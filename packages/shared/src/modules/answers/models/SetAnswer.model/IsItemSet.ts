import { ClassConstructor, plainToInstance } from "class-transformer";
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator, validateSync } from "class-validator";
import { ItemSetAnswerType, ItemSetAnswerVO, TextArraySetItemVO, TextSetItemVO } from "./ItemSetAnswer.model";
import { neverCase } from "#utils/typescript";

// eslint-disable-next-line custom/no-blank-lines-after-decorator
@ValidatorConstraint( {
  async: false,
} )
class IsItemSetAnswerConstraint implements ValidatorConstraintInterface {
  validate(itemSet: any, _args: ValidationArguments) {
    if (typeof itemSet !== "object")
      return false;

    const type = itemSet.type as ItemSetAnswerType;
    let instancePart;
    const clazz = determineClassByType(type);

    instancePart = plainToInstance(clazz, itemSet);

    const errors = validateSync(instancePart);

    return errors.length === 0;
  };

  defaultMessage(_args: ValidationArguments) {
    return "Each part must be valid and have a known type.";
  }
}

function determineClassByType(type: ItemSetAnswerType): ClassConstructor<ItemSetAnswerVO> {
  switch (type) {
    case ItemSetAnswerType.Text:
      return TextSetItemVO;
    case ItemSetAnswerType.TextArray:
      return TextArraySetItemVO;
    default:
      return neverCase(type);
  }
}

export function IsItemSet(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator( {
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsItemSetAnswerConstraint,
    } );
  };
}
