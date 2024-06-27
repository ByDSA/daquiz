import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsOptional } from "class-validator";

export class AnswerCheckResult {
  @IsBoolean()
  isCorrect!: boolean;

  @IsOptional()
  @IsArray()
  @Type(() => String)
  correctAnswers?: string[];
}
