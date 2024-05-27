import { PatchOneTextAnswerDto, ResultOneTextAnswerDto } from "#shared/models/answers/text-answers/dtos";
import { QuestionEntity } from "#shared/models/questions/Question";
import { fetchPatchOneAndGet } from "#modules/utils/fetching";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/answers/text";

export function patchOneTextAnswerAndGet(
  id: QuestionEntity["id"],
  dto: PatchOneTextAnswerDto,
): Promise<ResultOneTextAnswerDto> {
  return fetchPatchOneAndGet(URL, id, dto);
}
