import { QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { QuestionEntity } from "#shared/models/questions/Question";
import { QuizID } from "#shared/models/quizzes/Quiz";
import { ResultQuizPickQuestionsAnswersDto } from "#shared/models/quizzes/dtos";
import { useEffect, useState } from "react";
import { assertDefined } from "../../../../../shared/build/utils/validation/asserts";
import { useQuiz } from "../fetching";
import { checkForErrors } from "#modules/utils/fetching";

// eslint-disable-next-line no-empty-function
const pointlessNext = async () => {};

type Props = {
  quizId: QuizID;
};
type Ret = {
  questionEntity?: QuestionEntity;
  questionAnswerId?: QuestionAnswerID;
  next: ()=> Promise<void>;
};
export function usePickQuestion( { quizId }: Props): Ret {
  const { data, error, isLoading } = useQuiz(quizId);
  const [questionEntity, setQuestionEntity] = useState<QuestionEntity | null>(null);
  const [questionAnserId, setQuestionAnswerId] = useState<QuestionAnswerID | null>(null);

  if (error || !data || isLoading) {
    return {
      next: pointlessNext,
    };
  }

  const { questionAnswers } = data;

  if (!questionAnswers || questionAnswers.length === 0) {
    return {
      next: pointlessNext,
    };
  }

  const next = async () => {
    const responseJson = await fetchPickQuestion(quizId);
    const partialQuestionAnswer = responseJson.data?.pickedQuestions[0];

    assertDefined(partialQuestionAnswer);
    assertDefined(partialQuestionAnswer.question);

    const { question } = partialQuestionAnswer;

    setQuestionEntity(question);

    setQuestionAnswerId(partialQuestionAnswer.id);
  };

  useEffect(() => {
    next();
  }, []);

  return {
    questionEntity: questionEntity ?? undefined,
    questionAnswerId: questionAnserId ?? undefined,
    next,
  };
}

const genPickQuestionUrl = (quizId: QuizID) => `${process.env.NEXT_PUBLIC_BACKEND_URL}/quizzes/${quizId}/pickQuestion`;
const fetchPickQuestion = async (quizId: QuizID): Promise<ResultQuizPickQuestionsAnswersDto> => {
  const url = genPickQuestionUrl(quizId);
  const response = await fetch(url);
  const responseJson: ResultQuizPickQuestionsAnswersDto = await response.json();

  checkForErrors(response, responseJson);

  return responseJson;
};
