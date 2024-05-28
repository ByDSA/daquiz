import { TextAnswerVO } from "#shared/models/answers/text-answers/TextAnswer";
import { WithRequired } from "#shared/utils/typescript";
import { AnswerChecker, AnswerCheckerProps, AnswerCheckerReturn } from "./answer-checker";
import { extractRegexParts } from "#/utils/regexp";

type TextAnswerCheckerProps = WithRequired<AnswerCheckerProps<TextAnswerVO>, "correctAnswer">;

type TextAnswerCheckerReturn = AnswerCheckerReturn<TextAnswerVO>;

export const textAnswerChecker: AnswerChecker<TextAnswerVO> = (
  { correctAnswer, requestAnswer }: TextAnswerCheckerProps,
): TextAnswerCheckerReturn => {
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
