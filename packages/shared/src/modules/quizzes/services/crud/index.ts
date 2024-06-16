import { IsString } from "class-validator";
import { QuizID } from "../../models";

export class CreateQuizDto {
  @IsString()
  name!: QuizID;
};
