import { WithRequired } from "#shared/utils/typescript";
import { AnswerCheckerProps } from "./answer-checkers/answer-checker";
import { AnswerCheckResult } from "./models";
import { AnswerVO } from "#modules/answers/domain";

export type CheckAnswerProps = WithRequired<AnswerCheckerProps<AnswerVO>, "questionAnswerId"> & {
  includeQuestion?: boolean;
};

export interface Service {
  checkAnswer(props: CheckAnswerProps): Promise<AnswerCheckResult>;
}

export const Service = Symbol("QuestionTextAnswerCheckingService");
