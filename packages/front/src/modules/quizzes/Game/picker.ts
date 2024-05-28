import { QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { QuestionEntity } from "#shared/models/questions/Question";
import { QuizID } from "#shared/models/quizzes/Quiz";
import { useEffect, useState } from "react";
import { useQuiz } from "../fetching";

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

  // eslint-disable-next-line require-await
  const next = async () => {
    const index = Math.floor(Math.random() * questionAnswers.length);
    const questionAnswer = questionAnswers[index];
    const { question, questionId } = questionAnswer;

    setQuestionEntity( {
      id: questionId,
      ...question,
    } );

    setQuestionAnswerId(questionAnswer.id);
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
