import { QuestionAnswerEntity } from "#/questions-answers/models";
import { QuestionID, QuestionType } from "#/questions/models";
import { UnknownQuestionVO } from "#/questions/models/unknown";
import { AllOrNothing } from "#/utils/typescript";

type QuestionPartProps = AllOrNothing<
  { question: UnknownQuestionVO; questionType: QuestionType }
  > & {questionId?: QuestionID};

export type AnswerCheckerProps<ANSWER> = QuestionPartProps & {
  requestAnswer: ANSWER;
  correctAnswer?: ANSWER;
  questionAnswerId?: QuestionAnswerEntity["id"];
};

export type AnswerCheckerReturn<_ANSWER> = Promise<{
  isCorrect: boolean;
}>;

export type AnswerChecker<ANSWER> = (
  props: AnswerCheckerProps<ANSWER>
)=> AnswerCheckerReturn<ANSWER>;
