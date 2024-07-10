import { ClassConstructor, plainToInstance } from "class-transformer";
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator, validateSync } from "class-validator";
import { AnswerVO } from "./Answer.model";
import { AnswerType } from "./AnswerType.enum";
import { SetAnswerVO } from "./SetAnswer.model";
import { TextAnswerVO } from "./TextAnswer.model";
import { neverCase } from "#utils/typescript";

// eslint-disable-next-line custom/no-blank-lines-after-decorator
@ValidatorConstraint( {
  async: false,
} )
class IsAnswerConstraint implements ValidatorConstraintInterface {
  validate(answer: any, _args: ValidationArguments) {
    if (typeof answer !== "object")
      return false;

    const type = answer.type as AnswerType;
    let instancePart;
    const clazz = determineClassByType(type);

    instancePart = plainToInstance(clazz, answer);

    const errors = validateSync(instancePart);

    return errors.length === 0;
  };

  defaultMessage(_args: ValidationArguments) {
    return "Each part must be valid and have a known type.";
  }
}

function determineClassByType(type: AnswerType): ClassConstructor<AnswerVO> {
  switch (type) {
    case AnswerType.Text:
      return TextAnswerVO;
    case AnswerType.Set:
      return SetAnswerVO;
    default:
      return neverCase(type);
  }
}

export function IsAnswer(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator( {
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsAnswerConstraint,
    } );
  };
}
