import { QuizEntity } from "#shared/models/quizzes/Quiz";
import { CreateQuizDto } from "#shared/models/quizzes/dtos";
import { createFetchPipeCreateOneAndGet, createFetchPipeGetAll, createFetchPipeGetOne } from "#utils/fetching";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/quizzes";

export const { useQuery: useQuizzes } = createFetchPipeGetAll<QuizEntity>( {
  url: URL,
} );

export const { useQuery: useQuiz } = createFetchPipeGetOne<QuizEntity>( {
  url: URL,
} );

export const { useFetch: useCreateQuizAndGet } = createFetchPipeCreateOneAndGet<
QuizEntity, CreateQuizDto
>( {
  url: URL,
} );
