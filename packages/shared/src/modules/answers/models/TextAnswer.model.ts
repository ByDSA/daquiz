import { IsString } from "class-validator";
import { AnswerID } from "./Answer.model";
import { parseObject } from "#utils/validation/objects";

export class TextAnswerVO {
  @IsString()
  text!: string;
};

export type TextAnswerID = AnswerID;

export class TextAnswerEntity extends TextAnswerVO {
  @IsString()
  id!: TextAnswerID;
};

export function parseTextAnswer(obj: object): Promise<TextAnswerVO> {
  return parseObject(obj, TextAnswerVO);
}
