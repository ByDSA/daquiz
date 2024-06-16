import { Type } from "class-transformer";
import { IsObject, IsString } from "class-validator";
import { UnknownAnswerVO } from "#modules/answers/models";
import { QuestionAnswerEntity, QuestionAnswerID, QuestionAnswerVO } from "#modules/questions-answers/models";
import { QuestionVO } from "#modules/questions/models";
import { assertDefined } from "#utils/validation/asserts";

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
