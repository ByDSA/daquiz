import { QuizID } from "#shared/models/quizzes/Quiz";
import { ResultQuizPickQuestionsAnswersDto } from "#shared/models/quizzes/dtos";
import { validateOrReject } from "class-validator";
import { createFetchPipe, validateOkResponse } from "#utils/fetching";

export const { useFetch: useFetchPickQuestion } = createFetchPipe<
ResultQuizPickQuestionsAnswersDto,
QuizID
>( {
  fetchFn: (quizId: QuizID) => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/quizzes/${quizId}/pickQuestion`;

    return fetch(url);
  },
  postFetchValidation: validateOkResponse,
  transform: (res) => res.json(),
  postValidation: validateOrReject,
} );
