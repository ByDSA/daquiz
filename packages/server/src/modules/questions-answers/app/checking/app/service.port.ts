import { WithRequired } from "#shared/utils/typescript";
import { AnswerCheckerProps } from "./answer-checkers/answer-checker";
import { AnswerCheckResult } from "./models";
import { UnknownAnswerVO } from "#modules/answers/domain";

export type CheckAnswerProps = WithRequired<AnswerCheckerProps<UnknownAnswerVO>, "questionAnswerId"> & {
  includeQuestion?: boolean;
};

export interface Service {
  checkAnswer(props: CheckAnswerProps): Promise<AnswerCheckResult>;
}

export const Service = Symbol("QuestionTextAnswerCheckingService");
