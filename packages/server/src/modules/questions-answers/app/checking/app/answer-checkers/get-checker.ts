import { AnswerChecker } from "./answer-checker";
import { textAnswerChecker } from "./text-answer-checker";
import { AnswerType } from "#modules/answers/domain";

export function getAnswerCheckerByType(type: AnswerType): AnswerChecker<unknown> {
  switch (type) {
    case AnswerType.TEXT:
      return textAnswerChecker;
    default:
      throw new Error(`Unknown answer type: ${type}`);
  }
}
