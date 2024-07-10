import { Type } from "class-transformer";
import { IsArray, IsEnum, IsString } from "class-validator";
import { IsSpecificString } from "#utils/validation/decorators/IsSpecificString";

export enum ItemSetAnswerType {
  Text = "text",
  TextArray = "text-array",
}

export abstract class ItemSetAnswerVO {
  @IsEnum(ItemSetAnswerType)
  type!: ItemSetAnswerType;
}

export class TextSetItemVO extends ItemSetAnswerVO {
  @IsSpecificString(ItemSetAnswerType.Text)
  type!: ItemSetAnswerType.Text;

  @IsString()
  text!: string;
}

export class TextArraySetItemVO extends ItemSetAnswerVO {
  @IsSpecificString(ItemSetAnswerType.TextArray)
  type!: ItemSetAnswerType.TextArray;

  @IsArray()
  @Type(() => String)
  texts!: string[];
}
