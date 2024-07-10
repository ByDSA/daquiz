import "reflect-metadata";

import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export const IS_SPECIFIC_STRING = "isSpecificString";

export function IsSpecificString(value: string, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator( {
      name: IS_SPECIFIC_STRING,
      target: object.constructor,
      propertyName: propertyName,
      constraints: [value],
      options: validationOptions,
      validator: {
        validate(v: any, args: ValidationArguments) {
          const [expectedValue] = args.constraints;

          return typeof v === "string" && v === expectedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [expectedValue] = args.constraints;

          return `${args.property} must be equal to "${expectedValue}"`;
        },
      },
    } );
  };
}
