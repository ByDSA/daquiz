import { WithRequired } from "#shared/utils/typescript";
import { AnswerCheckResult } from "../models";
import { AnswerChecker, AnswerCheckerProps } from "./answer-checker";
import { extractRegexParts } from "#/utils/regexp";
import { TextAnswerVO } from "#/modules/answers/submodules/text-answer/domain";

type TextAnswerCheckerProps = WithRequired<AnswerCheckerProps<TextAnswerVO>, "correctAnswer">;

export const textAnswerChecker: AnswerChecker<TextAnswerVO> = (
  { correctAnswer, requestAnswer }: TextAnswerCheckerProps,
): Promise<AnswerCheckResult> => {
  const parts = extractRegexParts(correctAnswer.text);
  let isCorrect: boolean;

  if (parts) {
    const { pattern, flags } = parts;

    isCorrect = new RegExp(pattern, flags).test(requestAnswer.text);
  } else
    isCorrect = correctAnswer.text === requestAnswer.text;

  return Promise.resolve( {
    isCorrect,
  } );
};
