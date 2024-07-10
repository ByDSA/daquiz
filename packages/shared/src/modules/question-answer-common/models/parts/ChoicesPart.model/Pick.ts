import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

export type Pick = number | "multiple" | {
  min: number;
  max?: number;
};

@ValidatorConstraint( {
  name: "IsValidPick",
  async: false,
} )
export class IsValidPickConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments) {
    if (typeof value === "number" && value > 0)
      return true;

    if (value === "multiple")
      return true;

    if (typeof value === "object" && value !== null) {
      const { min, max } = value;

      return typeof min === "number" && (typeof max === "undefined" || (typeof max === "number" && min <= max));
    }

    return false;
  }

  defaultMessage(_args: ValidationArguments) {
    return "pick must be a number, \"multiple\", or an object with numerical \"min\" and \"max\" where min <= max";
  }
}
