import { CreateQuestionTextAnswerDto } from "#shared/models/questions-answers/text-answers/dtos";
import { QuestionEntity } from "#shared/models/questions/Question";
import { createFetchPipeCreateOneAndGet } from "#utils/fetching/fetch-crud/create-one-and-get-pipe";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/questions-answers/text-answer";

export const { useFetch: useCreateOneQuestionTextAnswerAndGet } = createFetchPipeCreateOneAndGet<
QuestionEntity, CreateQuestionTextAnswerDto
>( {
  url: URL,
} );
