import { ClassConstructor, plainToInstance } from "class-transformer";
import { ValidationArguments, ValidationError, ValidationOptions, ValidatorConstraintInterface, registerDecorator, validateSync } from "class-validator";
import { AnswerVO } from "./Answer.model";
import { AnswerType } from "./AnswerType.enum";
import { ArrayAnswerVO } from "./ArrayAnswer.model";
import { TextAnswerVO } from "./TextAnswer.model";
import { plainErrors } from "#utils/validation/decorators/errorsHelpers";
import { neverCase } from "#utils/typescript";

class IsAnswerConstraint implements ValidatorConstraintInterface {
  protected errors: ValidationError[] = [];

  validate(answer: any, _args: ValidationArguments) {
    if (typeof answer !== "object")
      return false;

    const type = answer.type as AnswerType;
    let instancePart;
    const clazz = determineClassByType(type);

    instancePart = plainToInstance(clazz, answer);

    const errors = validateSync(instancePart);

    if (errors.length > 0) {
      this.errors = errors;

      return false;
    }

    return true;
  };

  defaultMessage(_args: ValidationArguments) {
    return plainErrors(this.errors, "Answer must be valid and have a known type.");
  }
}

function determineClassByType(type: AnswerType): ClassConstructor<AnswerVO> {
  switch (type) {
    case AnswerType.Text:
      return TextAnswerVO;
    case AnswerType.Array:
      return ArrayAnswerVO;
    default:
      return neverCase(type);
  }
}

export function IsAnswer(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator( {
      async: false,
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsAnswerConstraint,
    } );
  };
}
