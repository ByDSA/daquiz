import { IsBoolean } from "class-validator";

export class AnswerCheckResult {
  @IsBoolean()
  isCorrect!: boolean;
}
