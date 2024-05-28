import { QuestionAnswerEntity } from "#shared/models/questions-answers/QuestionAnswer";
import { QuestionTextAnswerEntity } from "#shared/models/questions-answers/text-answers/QuestionTextAnswer";
import { useState } from "react";
import styles from "./styles.module.css";
import { patchOneQuestionAndGet } from "#modules/questions";
import { patchOneTextAnswerAndGet } from "#modules/answers";
import { classNames } from "#/modules/utils/styling";

type OnRemoveProps = {
  inputData: QuestionTextAnswerEntity;
  currentData: QuestionAnswerEntity;
};

type Props = {
  data: QuestionTextAnswerEntity;
  onRemove?: (props: OnRemoveProps)=> void;
};
const QuestionTextAnswer = ( { data, onRemove }: Props) => {
  const [questionText, setQuestionText] = useState(data.question?.text);
  const [answerType] = useState(data.answer?.type);
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
  const getCurrentData = () => ( {
    id: data.id,
    questionId: data.questionId,
    answerType: answerType,
    answerId: data.answerId,
  } );

  return (
    <div className={classNames(styles.main, styles.minWidth)}>
      {onRemove && <section className={styles.actionBlock} onClick={()=>onRemove( {
        inputData: data,
        currentData: getCurrentData(),
      } )}><article className={styles.removeButton}>X</article></section>}
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

export default QuestionTextAnswer;
