import { QuizID } from "#shared/models/quizzes/Quiz";
import { ResultQuizPickQuestionsAnswersDto } from "#shared/models/quizzes/dtos";
import { useState } from "react";
import { UseMutation, checkForErrors } from "#modules/utils/fetching";

const genPickQuestionUrl = (quizId: QuizID) => `${process.env.NEXT_PUBLIC_BACKEND_URL}/quizzes/${quizId}/pickQuestion`;
const fetchPickQuestion = async (quizId: QuizID): Promise<ResultQuizPickQuestionsAnswersDto> => {
  const url = genPickQuestionUrl(quizId);
  const response = await fetch(url);
  const responseJson: ResultQuizPickQuestionsAnswersDto = await response.json();

  checkForErrors(response, responseJson);

  return responseJson;
};

export const usePickQuestionQuery: UseMutation<ResultQuizPickQuestionsAnswersDto, QuizID> = () => {
  const [result, setResult] = useState<ResultQuizPickQuestionsAnswersDto | undefined>(undefined);
  const fn = async (quizId: QuizID) => {
    const res = await fetchPickQuestion(quizId);

    setResult(res);
  };

  return [
    fn,
    result,
  ];
};
