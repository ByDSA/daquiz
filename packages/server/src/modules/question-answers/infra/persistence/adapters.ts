import { assertDefined } from "#shared/utils/validation/asserts";
import { QuestionAnswerEntity } from "../../domain";
import { QuestionAnswerDocument } from "./schema";
import { QuestionRepo } from "#/modules/questions/infra";
import { TextAnswerRepo } from "#/modules/answers/submodules/text-answer";

type DocToEntityDeps = {
  questionRepo: QuestionRepo;
  answerRepo: TextAnswerRepo;
};
export const docToEntity = async (
  doc: QuestionAnswerDocument,
  deps: DocToEntityDeps,
): Promise<QuestionAnswerEntity> => {
  const id = doc._id.toString();
  const question = await deps.questionRepo.findOne(doc.questionId.toString());

  assertDefined(question, "Question not found for id=" + question);
  const answer = await deps.answerRepo.findOne(doc.answerId.toString());

  assertDefined(answer, "Question not found for id=" + answer);
  const entity: QuestionAnswerEntity = {
    id,
    question,
    answer,
  };

  return entity;
};
