import { TextAnswerVO } from "../text-answers/TextAnswer";

export type UnknownAnswerVO = TextAnswerVO;

export type UnknownAnswerEntity = UnknownAnswerVO & {id: unknown};
