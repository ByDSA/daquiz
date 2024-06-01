import { CreateQuestionTextAnswerDto } from "#shared/models/questions-answers/text-answers/dtos";
import { ResultOneQuestionDto } from "#shared/models/questions/dtos";
import { fetchCreateOneAndGet } from "#modules/utils/fetching";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/questions-answers/text-answer";

export function fetchCreateOneQuestionTextAnswerAndGet(
  dto: CreateQuestionTextAnswerDto,
): Promise<ResultOneQuestionDto> {
  return fetchCreateOneAndGet(URL, dto);
}
