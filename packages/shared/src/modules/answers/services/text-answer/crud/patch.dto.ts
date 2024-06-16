import { IsString } from "class-validator";

export class PatchOneTextAnswerDto {
  @IsString()
  text!: string;
};
