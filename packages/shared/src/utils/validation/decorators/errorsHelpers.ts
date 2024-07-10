import { ValidationError } from "class-validator";

export function plainErrors(errors: ValidationError[], defaultMessage: string = "Constraint error"): string {
  return errors.length > 0 ? validationErrorsToStringArray(errors).join(", ") : defaultMessage;
}

function validationErrorsToStringArray(errors: ValidationError[]): string[] {
  return errors.map(error => Object.values(error.constraints || {} ).join(", "));
}
