import { CreateOneQuestionDto, PatchOneQuestionDto, QuestionEntity, QuestionVO } from "./domain";
import { CreateOneAndGetService, FindAllService, FindOneService, PatchOneAndGetService } from "#/utils/services/crud";

export interface QuestionsServicePort extends
CreateOneAndGetService<CreateOneQuestionDto, QuestionEntity>,
FindOneService<QuestionEntity>,
FindAllService<QuestionEntity>,
PatchOneAndGetService<PatchOneQuestionDto, QuestionEntity> {
  patchOneAndGet(id: string, props: QuestionVO): Promise<QuestionEntity | null>;

  createOneAndGet(dto: CreateOneQuestionDto): Promise<QuestionEntity>;
}

export const QuestionsServicePort = Symbol("QuestionsServicePort");
