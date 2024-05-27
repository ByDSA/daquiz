import { ResultManyQuizDto, ResultOneQuizDto } from "#shared/models/quizzes/dtos";
import { generateFetcher, generateUseData, generateUseDataWithId } from "#modules/utils/swr";

const fetcherQuizzes = generateFetcher<ResultManyQuizDto>();

export const useQuizzes = generateUseData(process.env.NEXT_PUBLIC_BACKEND_URL + "/quizzes", fetcherQuizzes);
const fetcherQuiz = generateFetcher<ResultOneQuizDto>();

export const useQuiz = generateUseDataWithId(process.env.NEXT_PUBLIC_BACKEND_URL + "/quizzes", fetcherQuiz);
