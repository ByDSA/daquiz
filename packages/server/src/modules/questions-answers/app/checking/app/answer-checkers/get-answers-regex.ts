import { expand } from "regex-to-strings";

export function getAnswersFromRegex(regexStr: string): string[] {
  const regex = new RegExp(regexStr);
  const expander = expand(regex);
  const gotSet = new Set<string>();
  let i = 0;

  // Itera 'expander.count' veces, que son las posibles combinaciones de la regex
  for (const phoneNumber of expander.getIterator()) {
    if (i >= 20)
      break;

    gotSet.add(phoneNumber);

    i++;
  }

  return Array.from(gotSet);
}
