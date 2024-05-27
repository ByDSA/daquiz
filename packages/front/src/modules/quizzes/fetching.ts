import { ResultManyQuizDto, ResultOneQuizDto } from "#shared/models/quizzes/dtos";
import { generateFetcher, generateUseData, generateUseDataWithId } from "#modules/utils/fetching";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/quizzes";
const fetcherQuizzes = generateFetcher<ResultManyQuizDto>();

export const useQuizzes = generateUseData(URL, fetcherQuizzes);
const fetcherQuiz = generateFetcher<ResultOneQuizDto>();

export const useQuiz = generateUseDataWithId(URL, fetcherQuiz);
