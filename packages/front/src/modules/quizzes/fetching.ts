import { QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { QuizEntity, QuizID } from "#shared/models/quizzes/Quiz";
import { CreateQuizDto, ResultManyQuizDto, ResultOneQuizDto } from "#shared/models/quizzes/dtos";
import { checkForErrors, fetchCreateOneAndGet, fetchDeleteManyAndGet, fetchDeleteOneAndGet, generateFetcher, generateUseData, generateUseDataWithId } from "#modules/utils/fetching";

const URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/quizzes";
const fetcherQuizzes = generateFetcher<ResultManyQuizDto>();

export const useQuizzes = generateUseData(URL, fetcherQuizzes);
const fetcherQuiz = generateFetcher<ResultOneQuizDto>();

export const useQuiz = generateUseDataWithId(URL, fetcherQuiz);

const genUrlAdd = (quizId: string) => `${URL}/${quizId}/add`;

export const fetchCreateQuizAndGet = async (dto: CreateQuizDto) => {
  return await fetchCreateOneAndGet<QuizEntity, CreateQuizDto>(URL, dto);
};

export async function fetchAddQuestionAnswer(id: string, questionsAnswersIds: string[]) {
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

type RemoveOneQuestionTextAnswerAndGetProps = {
  quizId: QuizID;
  questionAnswerId: QuestionAnswerID;
};
const genDeleteOneUrl = ( { quizId, questionAnswerId }: RemoveOneQuestionTextAnswerAndGetProps) => `${URL}/${quizId}/remove/${questionAnswerId}`;

export async function fetchRemoveOneQuestionAnswer(
  props: RemoveOneQuestionTextAnswerAndGetProps,
) {
  const url = genDeleteOneUrl(props);

  await fetchDeleteOneAndGet(url);
}

type RemoveManyQuestionTextAnswerAndGetProps = {
  quizId: QuizID;
  ids: QuestionAnswerID[];
};
const genDeleteManyUrl = ( { quizId }: Pick<RemoveManyQuestionTextAnswerAndGetProps, "quizId">) => `${URL}/${quizId}/remove`;

export async function fetchRemoveManyQuestionsAnswers(
  { quizId, ids }: RemoveManyQuestionTextAnswerAndGetProps,
) {
  const url = genDeleteManyUrl( {
    quizId,
  } );

  await fetchDeleteManyAndGet(url, {
    ids,
  } );
}
