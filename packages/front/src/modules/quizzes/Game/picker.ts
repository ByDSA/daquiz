import { QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { QuestionEntity } from "#shared/models/questions/Question";
import { QuizID } from "#shared/models/quizzes/Quiz";
import { useEffect, useState } from "react";
import { assertDefined } from "../../../../../shared/build/utils/validation/asserts";
import { useFetchPickQuestion } from "./pick-question.service";

type Props = {
  quizId: QuizID;
};
type Ret = {
  questionEntity?: QuestionEntity;
  questionAnswerId?: QuestionAnswerID;
  next: ()=> Promise<void>;
};
export function usePickQuestion( { quizId }: Props): Ret {
  const [questionEntity, setQuestionEntity] = useState<QuestionEntity | null>(null);
  const [questionAnserId, setQuestionAnswerId] = useState<QuestionAnswerID | null>(null);
  const [pickQuestion, resultPickQuestion] = useFetchPickQuestion();

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
