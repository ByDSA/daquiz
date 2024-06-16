import { TextAnswerVO } from "./TextAnswer.model";

export type UnknownAnswerVO = TextAnswerVO;

export type UnknownAnswerEntity = UnknownAnswerVO & {id: unknown};
