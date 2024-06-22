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
  const [questionAnswerId, setQuestionAnswerId] = useState<QuestionAnswerID | null>(null);
  const [pickQuestion, resultPickQuestion] = useFetchPickQuestion();

  useEffect(() => {
    if (!resultPickQuestion)
      return;

    const partialQuestionAnswer = resultPickQuestion.data?.pickedQuestions[0];

    assertDefined(partialQuestionAnswer, "No question answer picked");
    assertDefined(partialQuestionAnswer.question);

    const { question } = partialQuestionAnswer;

    if (question.choices)
      shuffleChoices(question.choices);

    setQuestionEntity(question);

    setQuestionAnswerId(partialQuestionAnswer.id);
  }, [resultPickQuestion]);

  const next = async () => {
    await pickQuestion(quizId);
  };

  useEffect(() => {
    if (resultPickQuestion)
      return;

    next();
  }, []);

  return {
    questionEntity: questionEntity ?? undefined,
    questionAnswerId: questionAnswerId ?? undefined,
    next,
  };
}

function shuffleChoices(choices: any[]) {
  return choices.sort(() => Math.random() - 0.5);
}
