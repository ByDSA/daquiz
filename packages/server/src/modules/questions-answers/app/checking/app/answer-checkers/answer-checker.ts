import { AnswerCheckResult } from "../models";
import { QuestionAnswerID } from "#modules/questions-answers/domain";
import { QuestionID, QuestionVO } from "#modules/questions/domain";

type QuestionPartProps = {
  question?: QuestionVO;
  questionId?: QuestionID;
};

export type AnswerCheckerProps<ANSWER> = QuestionPartProps & {
  requestAnswer: ANSWER;
  correctAnswer?: ANSWER;
  questionAnswerId?: QuestionAnswerID;
};

export type AnswerChecker<ANSWER> = (
  props: AnswerCheckerProps<ANSWER>
)=> Promise<AnswerCheckResult>;
