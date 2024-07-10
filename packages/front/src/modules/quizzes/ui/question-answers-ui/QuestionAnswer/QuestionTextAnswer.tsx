import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { AnswerType, TextAnswerVO, usePatchOneTextAnswerAndGet } from "#modules/answers";
import { QuestionAnswerEntity } from "#modules/question-answers";
import { findFirstTextPart, usePatchOneQuestionAndGet } from "#modules/questions";
import { classNames } from "#utils/styling";

type OnRemoveProps = {
  inputData: QuestionAnswerEntity;
  currentData: QuestionAnswerEntity;
};

type Props = {
  data: QuestionAnswerEntity;
  onRemove?: (props: OnRemoveProps)=> void;
};
const QuestionTextAnswer = ( { data, onRemove }: Props) => {
  const initialQuestionText = findFirstTextPart(data.question)?.text;
  const initialAnswerText = data.answer.type === AnswerType.Text
    ? (data.answer as TextAnswerVO).text
    : undefined;
  const [questionText, setQuestionText] = useState(initialQuestionText);
  const [answerText, setAnswerText] = useState(initialAnswerText);
  const [patchOneTextAnswerAndGet, resultPatchAnswer] = usePatchOneTextAnswerAndGet();
  const [patchOneQuestionAndGet, resultPatchQuestion] = usePatchOneQuestionAndGet();

  useEffect(() => {
    if (resultPatchAnswer?.data)
      setAnswerText(resultPatchAnswer?.data.text);
  }, [resultPatchAnswer]);
  useEffect(() => {
    if (resultPatchQuestion?.data)
      setQuestionText(findFirstTextPart(resultPatchQuestion?.data)?.text);
  }, [resultPatchQuestion]);
  const questionOnClickHandler = async () => {
    const question = prompt("Enter your question:", questionText);

    if (!question)
      return;

    await patchOneQuestionAndGet( {
      id: data.id,
      dto: {
        text: question,
      },
    } );
  };
  const answerOnClickHandler = async () => {
    const answer = prompt("Enter your answer:", answerText);

    if (!answer)
      return;

    await patchOneTextAnswerAndGet(
      {
        id: data.id,
        dto: {
          text: answer,
        },
      },
    );
  };
  const getCurrentData = () => (data);

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
