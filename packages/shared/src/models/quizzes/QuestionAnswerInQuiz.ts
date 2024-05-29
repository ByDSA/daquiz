import { Type } from "class-transformer";
import { IsObject, IsString } from "class-validator";
import { UnknownAnswerVO } from "../answers/unknown-answers/UnknownAnswer";
import { QuestionAnswerEntity, QuestionAnswerID, QuestionAnswerVO } from "../questions-answers/QuestionAnswer";
import { QuestionVO } from "../questions/Question";
import { assertDefined } from "#/utils/validation/asserts";

export class QuestionAnswerInQuizVO extends QuestionAnswerVO {
  @IsObject()
  @Type(() => QuestionVO)
  question!: QuestionVO;

  @IsObject()
  answer!: UnknownAnswerVO;
};

export type QuestionAnswerInQuizID = string;

export class QuestionAnswerInQuizEntity extends QuestionAnswerInQuizVO {
  @IsString()
  id!: QuestionAnswerID;
};

export function questionAnswerEntityToQuestionAnswerInQuizEntity(
  questionAnswerEntity: QuestionAnswerEntity,
): QuestionAnswerInQuizEntity {
  assertDefined(questionAnswerEntity.question);
  assertDefined(questionAnswerEntity.answer);

  const questionAnswerInQuizEntity: QuestionAnswerInQuizEntity = {
    id: questionAnswerEntity.id,
    answer: questionAnswerEntity.answer,
    answerId: questionAnswerEntity.id,
    answerType: questionAnswerEntity.answerType,
    question: questionAnswerEntity.question,
    questionId: questionAnswerEntity.questionId,
  };

  return questionAnswerInQuizEntity;
}
