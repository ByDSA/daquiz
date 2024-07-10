import { ClassConstructor, plainToInstance } from "class-transformer";
import { ValidationArguments, ValidationError, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator, validateSync } from "class-validator";
import { ArrayPart } from "./ArrayPart.model";
import { AudioPart } from "./AudioPart.model";
import { ChoicesPart } from "./ChoicesPart.model";
import { ImagePart } from "./ImagePart.model";
import { Part, PartType } from "./Part.model";
import { SetsPart } from "./SetsPart.model";
import { TextPart } from "./TextPart.model";
import { VideoPart } from "./VideoPart.model";
import { plainErrors } from "#utils/validation/decorators/errorsHelpers";
import { neverCase } from "#utils/typescript";

// eslint-disable-next-line custom/no-blank-lines-after-decorator
@ValidatorConstraint( {
  async: false,
} )
class IsPartConstraint implements ValidatorConstraintInterface {
  #errors: ValidationError[] = [];

  validate(part: any, _args: ValidationArguments) {
    if (typeof part !== "object")
      return false;

    const type = part.type as PartType;
    let instancePart;
    const clazz = determineClassByType(type);

    instancePart = plainToInstance(clazz, part);

    const errors = validateSync(instancePart);

    if (errors.length > 0) {
      this.#errors = errors;

      return false;
    }

    return true;
  };

  defaultMessage(_args: ValidationArguments) {
    return plainErrors(this.#errors, "Each part must be valid and have a known type.");
  }
}

function determineClassByType(type: PartType): ClassConstructor<Part> {
  switch (type) {
    case PartType.Text:
      return TextPart;
    case PartType.Image:
      return ImagePart;
    case PartType.Audio:
      return AudioPart;
    case PartType.Choices:
      return ChoicesPart;
    case PartType.Video:
      return VideoPart;
    case PartType.Sets:
      return SetsPart;
    case PartType.Array:
      return ArrayPart;
    default:
      return neverCase(type);
  }
}

export function IsPart(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator( {
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPartConstraint,
    } );
  };
}
