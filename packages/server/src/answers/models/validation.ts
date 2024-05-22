import { parseTextAnswer } from "../text-answer/models";
import { UnknownAnswerVO } from "./unknown";
import { AnswerType } from ".";
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
