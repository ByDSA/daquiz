import { QuestionAnswerEntity } from "#shared/models/questions-answers/QuestionAnswer";
import { useState } from "react";
import styles from "./styles.module.css";
import { patchOneQuestionAndGet } from "#/modules/questions";
import { patchOneTextAnswerAndGet } from "#/modules/answers/fetching";
type Props = {
  data: QuestionAnswerEntity;
};
const QuestionAnswer = ( { data }: Props) => {
  const [questionText, setQuestionText] = useState(data.question?.text);
  const [answerText, setAnswerText] = useState(data.answer?.text);
  const questionOnClickHandler = async () => {
    const question = prompt("Enter your question:", questionText);

    if (!question)
      return;

    const got = await patchOneQuestionAndGet(data.questionId, {
      text: question,
    } );

    if (got.data)
      setQuestionText(got.data.text);
  };
  const answerOnClickHandler = async () => {
    const answer = prompt("Enter your answer:", answerText);

    if (!answer)
      return;

    const got = await patchOneTextAnswerAndGet(data.answerId, {
      text: answer,
    } );

    if (got.data)
      setAnswerText(got.data.text);
  };

  return (
    <div className={styles.main}>
      <section className={styles.question} onClick={questionOnClickHandler}>
        <header>Pregunta:</header>
        <p>{questionText}</p>
      </section>
      <section className={styles.answer} onClick={answerOnClickHandler}>
        <header>Respuesta:</header>
        <p>{answerText}</p>
      </section>
    </div>
  );
};

export default QuestionAnswer;
