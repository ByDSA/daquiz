import { AnswerChecker, AnswerCheckerProps, AnswerCheckerReturn } from "./answer-checker";
import { TextAnswerVO } from "#/answers/text-answer/models";
import { WithRequired } from "#/utils/typescript";

type TextAnswerCheckerProps = WithRequired<AnswerCheckerProps<TextAnswerVO>, "correctAnswer">;

type TextAnswerCheckerReturn = AnswerCheckerReturn<TextAnswerVO>;

export const textAnswerChecker: AnswerChecker<TextAnswerVO> = (
  { correctAnswer, requestAnswer }: TextAnswerCheckerProps,
): TextAnswerCheckerReturn => {
  const isCorrect = new RegExp(correctAnswer.text).test(requestAnswer.text);

  return Promise.resolve( {
    isCorrect,
  } );
};
