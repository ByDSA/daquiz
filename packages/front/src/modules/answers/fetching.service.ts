import { PatchOneTextAnswerDto } from "#shared/models/answers/text-answers/dtos";
import { QuestionEntity } from "#shared/models/questions/Question";
import { createFetchPipePatchOneAndGet } from "#utils/fetching";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/answers/text";

export const { useFetch: usePatchOneTextAnswerAndGet } = createFetchPipePatchOneAndGet<
QuestionEntity, PatchOneTextAnswerDto
>( {
  entityUrl: URL,
} );
