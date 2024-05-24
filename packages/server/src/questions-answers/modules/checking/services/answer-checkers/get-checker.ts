import { AnswerType } from "#shared/models/answers/Answer";
import { textAnswerChecker } from "./text-answer-checker";

export function getAnswerCheckerByType(type: AnswerType) {
  switch (type) {
    case AnswerType.TEXT:
      return textAnswerChecker;
    default:
      throw new Error(`Unknown answer type: ${type}`);
  }
}
