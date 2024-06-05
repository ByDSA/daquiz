import { WithRequired } from "#shared/utils/typescript";
import { AnswerCheckResult } from "../domain";
import { AnswerCheckerProps } from "./answer-checkers/answer-checker";
import { UnknownAnswerVO } from "#/answers/domain";

export type CheckAnswerProps = WithRequired<AnswerCheckerProps<UnknownAnswerVO>, "questionAnswerId"> & {
  includeQuestion?: boolean;
};

export interface QuestionAnswerCheckingServicePort {
  checkAnswer(props: CheckAnswerProps): Promise<AnswerCheckResult>;
}

export const QuestionAnswerCheckingServicePort = Symbol("QuestionAnswerCheckingServicePort");
