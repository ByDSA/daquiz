import { QuestionEntity } from "#shared/models/questions/Question";
import { PatchOneQuestionDto } from "#shared/models/questions/dtos";
import { createFetchPipePatchOneAndGet } from "#utils/fetching";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/questions";

export const { useFetch: usePatchOneQuestionAndGet } = createFetchPipePatchOneAndGet<
QuestionEntity, PatchOneQuestionDto
>( {
  entityUrl: URL,
} );
