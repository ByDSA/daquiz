import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export async function parseObject<T extends object>(
  obj: object,
  C: ClassConstructor<T>,
): Promise<T> {
  const objInstance = plainToInstance(C, obj);
  const errors = await validate(objInstance);

  if (errors.length > 0)
    throw new Error(errors.toString());

  return obj as T;
}
