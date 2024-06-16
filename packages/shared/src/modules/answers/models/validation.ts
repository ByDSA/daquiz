import { AnswerType } from "./AnswerType.enum";
import { parseTextAnswer } from "./TextAnswer.model";
import { UnknownAnswerVO } from "./UnknownAnswer.model";
import { neverCase } from "#utils/typescript";

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
