import { QuestionAnswerID } from "#/questions-answers/domain";
import { AnswerCheckResult } from "#/questions-answers/submodules/checking/domain";
import { QuestionID, QuestionVO } from "#/questions/domain";

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
