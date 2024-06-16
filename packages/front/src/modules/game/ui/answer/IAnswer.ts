import { QuestionEntity } from "#modules/questions";
import { QuestionAnswerID } from "#modules/questions-answers";

export type Props = {
  question: QuestionEntity;
  questionAnswerId: QuestionAnswerID;
  nextQuestion: ()=> Promise<void>;
};

export type IAnswer = (props: Props)=> JSX.Element | null;
