import { QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { AnswerCheckResult } from "#shared/models/questions-answers/checking/AnswerCheckResult";
import { QuestionID, QuestionVO } from "#shared/models/questions/Question";

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
