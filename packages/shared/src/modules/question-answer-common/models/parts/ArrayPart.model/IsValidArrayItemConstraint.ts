import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint( {
  name: "IsValidArrayItem",
  async: false,
} )
export class IsValidArrayItemConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const validTypes = args.constraints;

    return validTypes.includes(value?.type);
  }

  defaultMessage(args: ValidationArguments) {
    return `Each array item must be a valid type: ${args.constraints.join(", ")}`;
  }
}
