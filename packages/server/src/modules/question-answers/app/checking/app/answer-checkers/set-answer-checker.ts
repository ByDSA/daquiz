import { WithRequired } from "#shared/utils/typescript";
import { AnswerCheckResult } from "../models";
import { AnswerChecker, AnswerCheckerProps } from "./answer-checker";
import { ItemSetAnswerVO } from "#/modules/answers/submodules/text-answer/domain";

type CheckerProps = WithRequired<AnswerCheckerProps<ItemSetAnswerVO[]>, "correctAnswer">;

export const setAnswerChecker: AnswerChecker<ItemSetAnswerVO[]> = (
  { correctAnswer,
    requestAnswer,
    askForCorrectAnswer }: CheckerProps,
): Promise<AnswerCheckResult> => {
  let ret: AnswerCheckResult = {
    isCorrect: false,
  };

  // TODO
  throw new Error("Not implemented");

  // return Promise.resolve(ret);
};
