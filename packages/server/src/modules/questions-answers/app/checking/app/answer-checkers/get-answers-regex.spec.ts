import { getAnswersFromRegex } from "./get-answers-regex";

describe.each([
  ["asdf", ["asdf"]],
  ["a(b|c)?d", ["ad", "abd", "acd"]],
  ["aaa|bbb", ["aaa", "bbb"]],
  ["aaa|bbb", ["aaa", "bbb"]],
  ["(aaa|bbb)", ["aaa", "bbb"]],
  ["(aaa|bbb)", ["aaa", "bbb"]],
  ["(aaa|bbb)|(ccc|ddd)", ["aaa", "bbb", "ccc", "ddd"]],
  ["(a|b)c", ["ac", "bc"]],
  ["(a|b)(c|d)", ["ac", "ad", "bc", "bd"]],
  ["ab?", ["a", "ab"]],
])("getAnswersFromRegex: %s", (inputRegex, expected) => {
  it(`should return ${expected}`, () => {
    const actual = getAnswersFromRegex(inputRegex);

    expect(actual.length).toBe(expected.length);
    expect(actual).toEqual(expect.arrayContaining(expected));
  }, 2000);
} );
