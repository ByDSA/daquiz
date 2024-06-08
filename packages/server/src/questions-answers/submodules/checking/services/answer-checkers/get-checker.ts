import { textAnswerChecker } from "./text-answer-checker";
import { AnswerType } from "#/answers/domain";

export function getAnswerCheckerByType(type: AnswerType) {
  switch (type) {
    case AnswerType.TEXT:
      return textAnswerChecker;
    default:
      throw new Error(`Unknown answer type: ${type}`);
  }
}