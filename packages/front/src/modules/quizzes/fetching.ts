import { ResultManyQuizDto, ResultOneQuizDto } from "#shared/models/quizzes/dtos";
import { checkForErrors, generateFetcher, generateUseData, generateUseDataWithId } from "#modules/utils/fetching";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/quizzes";
const fetcherQuizzes = generateFetcher<ResultManyQuizDto>();

export const useQuizzes = generateUseData(URL, fetcherQuizzes);
const fetcherQuiz = generateFetcher<ResultOneQuizDto>();

export const useQuiz = generateUseDataWithId(URL, fetcherQuiz);

const genUrlAdd = (quizId: string) => `${URL}/${quizId}/add`;

export async function addQuestionAnswer(id: string, questionsAnswersIds: string[]) {
  const url = genUrlAdd(id);
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify( {
      questionsAnswersIds: questionsAnswersIds,
    } ),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  } );

  checkForErrors(response);
}
