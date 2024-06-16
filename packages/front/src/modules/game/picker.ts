import { assertDefined } from "#shared/utils/validation/asserts";
import { useEffect, useState } from "react";
import { useFetchPickQuestion } from "./services/pick-question/pick-question.service";
import { QuestionEntity } from "#modules/questions";
import { QuestionAnswerID } from "#modules/questions-answers";
import { QuizID } from "#modules/quizzes";

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
