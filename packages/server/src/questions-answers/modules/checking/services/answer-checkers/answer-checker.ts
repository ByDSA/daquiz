import { QuestionAnswerID } from "#/questions-answers/models";
import { QuestionID, QuestionVO } from "#/questions/models";

type QuestionPartProps = {
  question?: QuestionVO;
  questionId?: QuestionID;
};

export type AnswerCheckerProps<ANSWER> = QuestionPartProps & {
  requestAnswer: ANSWER;
  correctAnswer?: ANSWER;
  questionAnswerId?: QuestionAnswerID;
};

export type AnswerCheckerReturn<_ANSWER> = Promise<{
  isCorrect: boolean;
}>;

export type AnswerChecker<ANSWER> = (
  props: AnswerCheckerProps<ANSWER>
)=> AnswerCheckerReturn<ANSWER>;
