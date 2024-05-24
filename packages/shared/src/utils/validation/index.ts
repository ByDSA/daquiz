export function isObjectId(value: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(value);
}
