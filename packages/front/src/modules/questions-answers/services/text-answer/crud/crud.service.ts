import { CreateQuestionTextAnswerDto } from "./crud.dto";
import { QuestionEntity } from "#modules/questions";
import { createFetchPipeCreateOneAndGet } from "#utils/fetching";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/questions-answers/text-answer";

export const { useFetch: useCreateOneQuestionTextAnswerAndGet } = createFetchPipeCreateOneAndGet<
QuestionEntity, CreateQuestionTextAnswerDto
>( {
  url: URL,
} );
