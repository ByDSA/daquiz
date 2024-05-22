import { IsString } from "class-validator";
import { AnswerID } from "../models";
import { parseObject } from "#/utils/validation/objects";

export class TextAnswerVO {
  @IsString()
    text: string;
};

export type ID = AnswerID;

export class TextAnswerEntity extends TextAnswerVO {
  @IsString()
    id: ID;
};

export function parseTextAnswer(obj: object): Promise<TextAnswerVO> {
  return parseObject(obj, TextAnswerVO);
}
