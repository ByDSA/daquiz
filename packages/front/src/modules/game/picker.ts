import { assertDefined } from "#shared/utils/validation/asserts";
import { useEffect, useState } from "react";
import { useFetchPickQuestion } from "./services/pick-question/pick-question.service";
import { QuestionAnswerID } from "#modules/question-answers";
import { ChoicesPart, QuestionVO } from "#modules/questions";
import { QuizID } from "#modules/quizzes";

type Props = {
  quizId: QuizID;
};
type Ret = {
  questionEntity?: QuestionVO;
  questionAnswerId?: QuestionAnswerID;
  next: ()=> Promise<void>;
};
export function usePickQuestion( { quizId }: Props): Ret {
  const [questionEntity, setQuestionEntity] = useState<QuestionVO | null>(null);
  const [questionAnswerId, setQuestionAnswerId] = useState<QuestionAnswerID | null>(null);
  const [pickQuestion, resultPickQuestion] = useFetchPickQuestion();

  useEffect(() => {
    if (!resultPickQuestion)
      return;

    const partialQuestionAnswer = resultPickQuestion.data?.pickedQuestions[0];

    assertDefined(partialQuestionAnswer, "No question answer picked");
    assertDefined(partialQuestionAnswer.question);

    const { question } = partialQuestionAnswer;
    const choicePart: ChoicesPart | undefined = question.parts.find((part) => part.type === "choices") as ChoicesPart | undefined;
    const choices = choicePart?.choices;

    if (choices)
      shuffleChoices(choices);

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
