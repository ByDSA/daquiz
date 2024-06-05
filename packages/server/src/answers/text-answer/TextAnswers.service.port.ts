import { CreateTextAnswerDto, PatchOneTextAnswerDto, TextAnswerEntity } from "./domain";
import { CreateOneAndGetService, FindAllService, FindOneService, PatchOneAndGetService } from "#/utils/services/crud";

export interface TextAnswersServicePort extends
CreateOneAndGetService<CreateTextAnswerDto, TextAnswerEntity>,
FindOneService<TextAnswerEntity>,
FindAllService<TextAnswerEntity>,
PatchOneAndGetService<PatchOneTextAnswerDto, TextAnswerEntity> {
}

export const TextAnswersServicePort = Symbol("TextAnswersServicePort");
