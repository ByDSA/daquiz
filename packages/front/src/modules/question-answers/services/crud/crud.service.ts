import { QuestionEntity } from "#modules/questions";
import { createFetchPipeCreateOneAndGet } from "#utils/fetching";
import { CreateQuestionAnswerDto } from "./crud.dto";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/question-answers";

export const { useFetch: useCreateOneQuestionAnswerAndGet } = createFetchPipeCreateOneAndGet<
QuestionEntity, CreateQuestionAnswerDto
>( {
  url: URL,
} );
