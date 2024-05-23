import { TextAnswerVO } from "../text-answer/models";

export type UnknownAnswerVO = TextAnswerVO;

export type UnknownAnswerEntity = UnknownAnswerVO & {id: unknown};
