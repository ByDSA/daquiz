export function classNames(...classes: (boolean | string | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export type Themeable = {
  className?: string;
};
