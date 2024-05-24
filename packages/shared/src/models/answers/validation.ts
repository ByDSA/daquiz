import { AnswerType } from "./Answer";
import { parseTextAnswer } from "./text-answers/TextAnswer";
import { UnknownAnswerVO } from "./unknown-answers/UnknownAnswer";
import { neverCase } from "#/utils/typescript";

export function parseAnswer(
  requestAnswer: UnknownAnswerVO,
  answerType: AnswerType,
): Promise<UnknownAnswerVO> {
  switch (answerType) {
    case AnswerType.TEXT:
      return parseTextAnswer(requestAnswer);
    default:
      return neverCase(answerType);
  }
}
