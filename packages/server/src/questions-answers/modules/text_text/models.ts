import { AnswerID } from "#/answers/models";
import { TextAnswerVO } from "#/answers/text-answer/models";
import { QuestionID } from "#/questions/models";
import { TextQuestionVO } from "#/questions/text-question/models";

export type TextQuestionTextAnswerVO = {
  questionId: QuestionID;
  question?: TextQuestionVO;
  answerId: AnswerID;
  answer?: TextAnswerVO;
};

export type ID = string;

export type TextQuestionTextAnswerEntity = TextQuestionTextAnswerVO & {
  id: ID;
};
