import { QuestionEntity } from "#shared/models/questions/Question";
import { PatchOneQuestionDto, ResultOneQuestionDto } from "#shared/models/questions/dtos";
import { fetchPatchOneAndGet } from "#modules/utils/fetching";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/questions";

export function patchOneQuestionAndGet(
  id: QuestionEntity["id"],
  dto: PatchOneQuestionDto,
): Promise<ResultOneQuestionDto> {
  return fetchPatchOneAndGet(URL, id, dto);
}
