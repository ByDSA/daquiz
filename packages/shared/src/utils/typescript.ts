export function neverCase(value: never): never {
  const never: never = value;

  throw new Error(`Unknown value: ${never}`);
}

// Source: https://stackoverflow.com/a/69328045
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type WithPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type AllOrNothing<T extends object> =
  T | { [K in keyof T]?: never };
