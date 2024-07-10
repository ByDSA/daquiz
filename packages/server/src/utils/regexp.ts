/* eslint-disable prefer-destructuring */
export function extractRegexParts(regexString) {
  const regexPattern = /^\/(.+)\/([a-z]*)$/;
  const match = regexString.match(regexPattern);

  if (!match)
    return null;

  const pattern = match[1];
  const flags = match[2];

  return {
    pattern,
    flags,
  };
}
