export function assertDefined<T>(value: T, msg?: string): asserts value is NonNullable<T> {
  if (value === undefined || value === null)
    throw new Error(msg ?? "Value is not defined");
}
