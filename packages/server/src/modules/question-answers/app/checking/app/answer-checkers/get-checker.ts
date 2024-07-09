import { neverCase } from "#shared/utils/typescript";
import { AnswerChecker } from "./answer-checker";
import { setAnswerChecker } from "./set-answer-checker";
import { textAnswerChecker } from "./text-answer-checker";
import { AnswerType } from "#modules/answers/domain";

export function resolveAnswerCheckerByType(type: AnswerType): AnswerChecker<unknown> {
  switch (type) {
    case AnswerType.Text:
      return textAnswerChecker;
    case AnswerType.Set:
      throw setAnswerChecker;
    default:
      return neverCase(type);
  }
}
