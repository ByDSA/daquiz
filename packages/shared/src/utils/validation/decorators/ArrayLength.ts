import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export const ARRAY_LENGTH = "arrayLength";

export function ArrayLength(value: number, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator( {
      name: ARRAY_LENGTH,
      target: object.constructor,
      propertyName: propertyName,
      constraints: [value],
      options: validationOptions,
      validator: {
        validate(v: any, args: ValidationArguments) {
          const [expectedValue] = args.constraints;

          return Array.isArray(v) && v.length === expectedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [expectedValue] = args.constraints;

          return `${args.property} must be an array with ${expectedValue} elements`;
        },
      },
    } );
  };
}
