import { AnswerCheckResult } from "../models";
import { QuestionAnswerID } from "#modules/question-answers/domain";
import { QuestionVO } from "#modules/questions/domain";

type QuestionPartProps = {
  question?: QuestionVO;
  questionId?: QuestionAnswerID;
};

export type AnswerCheckerProps<ANSWER> = QuestionPartProps & {
  requestAnswer: ANSWER;
  correctAnswer?: ANSWER;
  questionAnswerId?: QuestionAnswerID;
  askForCorrectAnswer?: boolean;
};

export type AnswerChecker<ANSWER> = (
  props: AnswerCheckerProps<ANSWER>
)=> Promise<AnswerCheckResult>;
