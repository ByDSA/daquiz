import { TextAnswerRepo } from "#/modules/answers/submodules/text-answer";
import { QuestionRepo } from "#/modules/questions/infra";
import { assertDefined } from "#shared/utils/validation/asserts";
import { QuestionAnswerEntity } from "../../domain";
import { QuestionAnswerDocument } from "./schema";

type DocToEntityDeps = {
  questionRepo: QuestionRepo;
  answerRepo: TextAnswerRepo;
};
export const docToEntity = async (
  doc: QuestionAnswerDocument,
  deps: DocToEntityDeps,
): Promise<QuestionAnswerEntity> => {
  const id = doc._id.toString();
  const question = await deps.questionRepo.findOneByInnerId(doc.questionId.toString());

  assertDefined(question, "Question not found for id=" + question);
  const answer = await deps.answerRepo.findOneByInnerId(doc.answerId.toString());

  assertDefined(answer, "Answer not found for id=" + answer);
  const entity: QuestionAnswerEntity = {
    id,
    question,
    answer,
  };

  return entity;
};
