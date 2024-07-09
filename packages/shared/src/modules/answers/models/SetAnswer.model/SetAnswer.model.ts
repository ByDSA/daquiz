import { ArrayMinSize, IsArray, ValidateNested } from "class-validator";
import { AnswerVO } from "../Answer.model";
import { AnswerType } from "../AnswerType.enum";
import { IsItemSet } from "./IsItemSet";
import { ItemSetAnswerVO } from "./ItemSetAnswer.model";
import { IsSpecificString } from "#utils/validation/decorators/IsSpecificString";

export class SetAnswerVO extends AnswerVO {
  @IsSpecificString(AnswerType.Set)
  type!: AnswerType.Set;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @IsItemSet( {
    each: true,
  } )
  set!: ItemSetAnswerVO[];
};
