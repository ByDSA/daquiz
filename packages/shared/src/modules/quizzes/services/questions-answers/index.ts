import { IsString } from "class-validator";
import { QuestionAnswerID } from "#modules/question-answers/models";
import { RemoveManyDto } from "#utils/dtos";

export class AddQuestionsAnswersDto {
  @IsString( {
    each: true,
  } )
  questionsAnswersIds!: QuestionAnswerID[];
}

export class RemoveManyQuestionsAnswersDto extends RemoveManyDto<QuestionAnswerID> { }
