import { ArrayMinSize, IsArray, IsEnum, ValidateNested } from "class-validator";
import { AnswerVO } from "../Answer.model";
import { AnswerType } from "../AnswerType.enum";
import { ArrayType } from "./ArrayType";
import { ArrayPart } from "#modules/question-answer-common/models/parts/ArrayPart.model";
import { IsPart } from "#modules/question-answer-common/models/parts/IsPart";
import { TextPart } from "#modules/questions/models";
import { IsSpecificString } from "#utils/validation/decorators/IsSpecificString";

export type ArrayItem = ArrayPart | TextPart;

export class ArrayAnswerVO extends AnswerVO {
  @IsSpecificString(AnswerType.Array)
  type!: AnswerType.Array;

  @IsEnum(ArrayType)
  arrayType!: ArrayType;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @IsPart( {
    each: true,
  } )
  content!: ArrayItem[];
};
