import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { AnswerType, usePatchOneTextAnswerAndGet } from "#modules/answers";
import { usePatchOneQuestionAndGet } from "#modules/questions";
import { QuestionAnswerEntity, QuestionTextAnswerEntity } from "#modules/questions-answers";
import { classNames } from "#utils/styling";

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
  const [answerType] = useState(AnswerType.TEXT);
  const [answerText, setAnswerText] = useState(data.answer?.text);
  const [patchOneTextAnswerAndGet, resultPatchAnswer] = usePatchOneTextAnswerAndGet();
  const [patchOneQuestionAndGet, resultPatchQuestion] = usePatchOneQuestionAndGet();

  useEffect(() => {
    if (resultPatchAnswer?.data)
      setAnswerText(resultPatchAnswer?.data.text);
  }, [resultPatchAnswer]);
  useEffect(() => {
    if (resultPatchQuestion?.data)
      setQuestionText(resultPatchQuestion?.data.text);
  }, [resultPatchQuestion]);
  const questionOnClickHandler = async () => {
    const question = prompt("Enter your question:", questionText);

    if (!question)
      return;

    await patchOneQuestionAndGet( {
      id: data.questionId,
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
        id: data.answerId,
        dto: {
          text: answer,
        },
      },
    );
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
