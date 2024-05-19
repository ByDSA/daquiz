import { AnswerID } from "../models";

export type TextAnswerVO = {
  text: string;
};

export type ID = AnswerID;

export type TextAnswerEntity = TextAnswerVO & {
  id: ID;
};
