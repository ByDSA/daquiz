import { CreateOneQuestionDto, PatchOneQuestionDto, QuestionEntity } from "../../../domain";
import { CreateOneAndGetService, FindAllService, FindOneService, PatchOneAndGetService } from "#/utils/services/crud";

export interface Repo extends
CreateOneAndGetService<CreateOneQuestionDto, QuestionEntity>,
FindOneService<QuestionEntity>,
FindAllService<QuestionEntity>,
PatchOneAndGetService<PatchOneQuestionDto, QuestionEntity> {
  patchOneAndGet(id: string, dto: PatchOneQuestionDto): Promise<QuestionEntity | null>;

  createOneAndGet(dto: CreateOneQuestionDto): Promise<QuestionEntity>;
}

export const Repo = Symbol("QuestionRepo");
