import { AnswerID, AnswerType } from "#/answers/models";
import { UnknownAnswerVO } from "#/answers/models/unknown";
import { QuestionID, QuestionType } from "#/questions/models";
import { UnknownQuestionVO } from "#/questions/models/unknown";

export type QuestionAnswerVO = {
  questionType: QuestionType;
  questionId: QuestionID;
  question?: UnknownQuestionVO;
  answerType: AnswerType;
  answerId: AnswerID;
  answer?: UnknownAnswerVO;
};

export type ID = string;

export type QuestionAnswerEntity = QuestionAnswerVO & {
  id: ID;
};
