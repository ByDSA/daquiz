import { ChangeEvent, useState } from "react";
import { AnswerType } from "../../../../../shared/build/models/answers/Answer";
import { neverCase } from "../../../../../shared/build/utils/typescript";
import { assertDefined } from "../../../../../shared/build/utils/validation/asserts";
import { fetchCreateOneQuestionTextAnswerAndGet } from "../QuestionAnswer/fetching";
import { fetchAddQuestionAnswer } from "../fetching";
import styles from "./styles.module.css";

type AddNewQuestionAnswerProps = {
  quizId: string;
  revalidateData: ()=> Promise<any>;
};
const AddNewQuestionAnswer = ( { quizId, revalidateData }: AddNewQuestionAnswerProps) => {
  const [answerType, setAnswerType] = useState(AnswerType.TEXT);
  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAnswerType(event.target.value as AnswerType);
  };

  return (<section className={styles.addNewSection}>
    <h2>Añadir nueva pregunta:</h2>
    <form onSubmit={genOnSubmitHandler( {
      quizId,
      revalidateData,
    } )}>
      <input type="text" placeholder="Pregunta" name="question-text"/>
      <fieldset>
        <legend>Tipo de respuesta:</legend>
        {
          Object.values(AnswerType).map((type) => (
            <article key={type.toString()}>
              <input type="radio" name="answer-type" id={"answerType-input-" + type} value={type} checked={answerType === type} onChange={onChangeHandler}/>
              <label htmlFor="text">{answerTypeLocale(type)}</label>
            </article>
          ))
        }
      </fieldset>
      {inputsByAnswerType(answerType)}
      <button type="submit" className={styles.button}>Añadir</button>
    </form>
  </section>);
};

export default AddNewQuestionAnswer;
const answerTypeLocale = (answerType: AnswerType) => {
  switch (answerType) {
    case AnswerType.TEXT:
      return "Texto";
    default:
      return neverCase(answerType);
  }
};
const inputsByAnswerType = (answerType: AnswerType) => {
  switch (answerType) {
    case AnswerType.TEXT:
      return <input type="text" placeholder="Respuesta" name="answer-text"/>;
    default:
      return neverCase(answerType);
  }
};

type GenOnSubmitHandlerProps = {
  quizId: string;
  revalidateData: ()=> Promise<any>;
};
const genOnSubmitHandler = ( { quizId, revalidateData }: GenOnSubmitHandlerProps) => {
  return async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { currentTarget } = event;
    const formData = new FormData(currentTarget);
    const answerType = formData.get("answer-type") as AnswerType;

    assertDefined(answerType);
    const questionText = formData.get("question-text") as string;

    if (!questionText) {
      alert("La pregunta no puede estar vacía");

      return;
    }

    const answerText = formData.get("answer-text") as string;

    if (!answerText) {
      alert("La respuesta no puede estar vacía");

      return;
    }

    const createdQuestionAnswer = await fetchCreateOneQuestionTextAnswerAndGet( {
      question: questionText,
      answer: answerText,
    } );
    const createdQuestionAnswerId = createdQuestionAnswer?.data?.id;

    assertDefined(createdQuestionAnswerId);

    await fetchAddQuestionAnswer(quizId, [createdQuestionAnswerId])
      .catch((error) => {
        throw error;
      } );

    await revalidateData();

    currentTarget.reset();
  };
};
