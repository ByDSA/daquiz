import { QuizEntity } from "../../models";
import { CreateQuizDto } from "./crud.dto";
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
