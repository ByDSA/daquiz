import { QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { QuestionEntity } from "#shared/models/questions/Question";

export type Props = {
  question: QuestionEntity;
  questionAnswerId: QuestionAnswerID;
  nextQuestion: ()=> Promise<void>;
};

export type IAnswer = (props: Props)=> JSX.Element | null;
