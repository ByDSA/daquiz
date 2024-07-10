import { IsString } from "class-validator";
import { AnswerVO } from "./Answer.model";
import { AnswerType } from "./AnswerType.enum";
import { IsSpecificString } from "#utils/validation/decorators/IsSpecificString";
import { BaseEntity } from "#utils/entity";

export class TextAnswerVO extends AnswerVO {
  @IsSpecificString(AnswerType.Text)
  type!: AnswerType.Text;

  @IsString()
  text!: string;
};

/**
 * @deprecated
 */
export class TextAnswerEntity extends TextAnswerVO implements BaseEntity<string> {
  @IsString()
  id!: string;
}
