import { QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { QuestionEntity } from "#shared/models/questions/Question";
import { QuizID } from "#shared/models/quizzes/Quiz";
import { useEffect, useState } from "react";
import { assertDefined } from "../../../../../shared/build/utils/validation/asserts";
import { useQuiz } from "../services";
import { usePickQuestionQuery } from "./pick-question.service";

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
  const [pickQuestion, resultPickQuestion] = usePickQuestionQuery();

  useEffect(() => {
    if (!resultPickQuestion)
      return;

    const partialQuestionAnswer = resultPickQuestion.data?.pickedQuestions[0];

    assertDefined(partialQuestionAnswer);
    assertDefined(partialQuestionAnswer.question);

    const { question } = partialQuestionAnswer;

    setQuestionEntity(question);

    setQuestionAnswerId(partialQuestionAnswer.id);
  }, [resultPickQuestion]);

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
    await pickQuestion(quizId);
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
