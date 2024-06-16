import { IsString } from "class-validator";

export class CreateTextAnswerDto {
  @IsString()
  text!: string;
};
