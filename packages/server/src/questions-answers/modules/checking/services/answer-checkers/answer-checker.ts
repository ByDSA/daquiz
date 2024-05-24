import { QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
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

export type AnswerCheckerReturn<_ANSWER> = Promise<{
  isCorrect: boolean;
}>;

export type AnswerChecker<ANSWER> = (
  props: AnswerCheckerProps<ANSWER>
)=> AnswerCheckerReturn<ANSWER>;
