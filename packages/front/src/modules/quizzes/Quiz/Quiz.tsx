import { QuizEntity } from "#shared/models/quizzes/Quiz";
import { ChangeEvent, useState } from "react";
import { AnswerType } from "../../../../../shared/build/models/answers/Answer";
import { neverCase } from "../../../../../shared/build/utils/typescript";
import { assertDefined } from "../../../../../shared/build/utils/validation/asserts";
import { QuestionTextAnswer } from "../QuestionAnswer";
import { createOneQuestionTextAnswerAndGet } from "../QuestionAnswer/fetching";
import { addQuestionAnswer } from "../fetching";
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
        <QuestionTextAnswer
          key={questionAnswer.id}
          data={questionAnswer}
          onRemove={( { inputData } )=>{
            console.log("Remove");
            console.log(inputData.id);
          }}/>
      ))}
      <AddNewQuestionAnswer quizId={data.id} />
    </>
  );
};

export default Quiz;

function questionsLocale(questionsLength: number) {
  return questionsLength === 1 ? "pregunta" : "preguntas";
}

type AddNewQuestionAnswerProps = {
  quizId: string;
};
const AddNewQuestionAnswer = ( { quizId }: AddNewQuestionAnswerProps) => {
  const [answerType, setAnswerType] = useState(AnswerType.TEXT);
  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAnswerType(event.target.value as AnswerType);
  };

  return (<section className={styles.addNewSection}>
    <h2>Añadir nueva pregunta:</h2>
    <form onSubmit={genOnSubmitHandler( {
      quizId,
    } )}>
      <input type="text" placeholder="Pregunta" name="question-text"/>
      <fieldset>
        <legend>Tipo de respuesta:</legend>
        {
          Object.values(AnswerType).map((type) => (
            <article>
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
};
const genOnSubmitHandler = ( { quizId }: GenOnSubmitHandlerProps) => {
  return async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
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

    const createdQuestionAnswer = await createOneQuestionTextAnswerAndGet( {
      question: questionText,
      answer: answerText,
    } );
    const createdQuestionAnswerId = createdQuestionAnswer?.data?.id;

    assertDefined(createdQuestionAnswerId);

    await addQuestionAnswer(quizId, [createdQuestionAnswerId])
      .catch((error) => {
        throw error;
      } );

    event.currentTarget.reset();
  };
};
