import { CreateTextAnswerDto, PatchOneTextAnswerDto, TextAnswerEntity } from "../../../domain";
import { CreateOneAndGetService, FindAllService, FindOneService, PatchOneAndGetService } from "#utils/services/crud";

export interface Repo extends
CreateOneAndGetService<CreateTextAnswerDto, TextAnswerEntity>,
FindOneService<TextAnswerEntity>,
FindAllService<TextAnswerEntity>,
PatchOneAndGetService<PatchOneTextAnswerDto, TextAnswerEntity> {
  findOneByInnerId(id: string): Promise<TextAnswerEntity | null>;
}

export const Repo = Symbol("TextAnswerRepo");
