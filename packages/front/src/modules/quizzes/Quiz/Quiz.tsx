import { QuizEntity } from "#shared/models/quizzes/Quiz";
import QuestionAnswer from "../QuestionAnswer";
import styles from "./styles.module.css";

type Props = {
  data: QuizEntity | undefined;
};
const Quiz = ( { data }: Props) => {
  if (!data)
    return null;

  const { questionAnswers } = data;
  const questionsAnswersLength = questionAnswers?.length ?? 0;
  const questionsAnswersInfo = <section className={styles.resultInfo}>{questionsAnswersLength + " " + questionsLocale(questionsAnswersLength)}</section>;

  return (
    <>
      {questionsAnswersInfo}
      {questionAnswers?.map((questionAnswer) => (
        <QuestionAnswer key={questionAnswer.id} data={questionAnswer} />
      ))}
    </>
  );
};

export default Quiz;

function questionsLocale(questionsLength: number) {
  return questionsLength === 1 ? "pregunta" : "preguntas";
}
