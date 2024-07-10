import { WithRequired } from "#shared/utils/typescript";
import { AnswerCheckResult } from "../models";
import { AnswerChecker, AnswerCheckerProps } from "./answer-checker";
import { getAnswersFromRegex } from "./get-answers-regex";
import { extractRegexParts } from "#utils/regexp";
import { TextAnswerVO } from "#modules/answers/submodules/text-answer/domain";

type TextAnswerCheckerProps = WithRequired<AnswerCheckerProps<TextAnswerVO>, "correctAnswer">;

export const textAnswerChecker: AnswerChecker<TextAnswerVO> = (
  { correctAnswer,
    requestAnswer,
    askForCorrectAnswer: includeCorrectAnswers }: TextAnswerCheckerProps,
): Promise<AnswerCheckResult> => {
  const parts = extractRegexParts(correctAnswer.text);
  let ret: AnswerCheckResult = {
    isCorrect: false,
  };

  if (parts) {
    const { pattern, flags } = parts;

    ret.isCorrect = new RegExp(pattern, flags).test(requestAnswer.text);

    if (includeCorrectAnswers)
      ret.correctAnswers = getAnswersFromRegex(pattern);
  } else {
    ret.isCorrect = correctAnswer.text === requestAnswer.text;

    if (includeCorrectAnswers)
      ret.correctAnswers = [correctAnswer.text];
  }

  return Promise.resolve(ret);
};
