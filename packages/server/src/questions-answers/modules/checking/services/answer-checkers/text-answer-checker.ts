import { TextAnswerVO } from "#shared/models/answers/text-answers/TextAnswer";
import { WithRequired } from "#shared/utils/typescript";
import { AnswerChecker, AnswerCheckerProps, AnswerCheckerReturn } from "./answer-checker";

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
