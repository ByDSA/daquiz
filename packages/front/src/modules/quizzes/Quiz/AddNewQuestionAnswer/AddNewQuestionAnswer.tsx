import { ChoiceDto } from "#shared/models/questions/dtos";
import { ChangeEvent, useState } from "react";
import { AnswerType } from "../../../../../../shared/build/models/answers/Answer";
import { neverCase } from "../../../../../../shared/build/utils/typescript";
import { assertDefined } from "../../../../../../shared/build/utils/validation/asserts";
import { fetchCreateOneQuestionTextAnswerAndGet } from "../../QuestionAnswer/fetching";
import { fetchAddQuestionAnswer } from "../../fetching";
import NewQuestion, { FORM_QUESTION_CHOICE_PREFIX_NAME, FORM_QUESTION_TEXT_NAME } from "./NewQuestion";
import { useChoices } from "./UseChoices";
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
  const { choices, addChoice, removeChoice, updateChoice, clearAllChoices } = useChoices();
  const clearForm: ClearFormFn = ( { formRef } ) => {
    formRef.reset();
    clearAllChoices();
  };

  return (<section className={styles.addNewSection}>
    <h2>Añadir nueva pregunta:</h2>
    <form onSubmit={genOnSubmitHandler( {
      quizId,
      revalidateData,
      clearForm,
    } )}>
      {NewQuestion( {
        choices: {
          choices,
          addChoice,
          removeChoice,
          updateChoice,
          clearAllChoices,
        },

      } )}
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

type ClearFormProps = {
  formRef: HTMLFormElement;
};
type ClearFormFn = (props: ClearFormProps)=> void;
type GenOnSubmitHandlerProps = {
  quizId: string;
  revalidateData: ()=> Promise<any>;
  clearForm: ClearFormFn;
};
const genOnSubmitHandler = ( { quizId, revalidateData, clearForm }: GenOnSubmitHandlerProps) => {
  return async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { currentTarget } = event;
    const formData = new FormData(currentTarget);
    const answerType = formData.get("answer-type") as AnswerType;

    assertDefined(answerType);
    const questionText = formData.get(FORM_QUESTION_TEXT_NAME) as string;

    if (!questionText) {
      alert("La pregunta no puede estar vacía");

      return;
    }

    const answerText = formData.get("answer-text") as string;

    if (!answerText) {
      alert("La respuesta no puede estar vacía");

      return;
    }

    const choices = getChoices(formData, answerText);
    const createdQuestionAnswer = await fetchCreateOneQuestionTextAnswerAndGet( {
      question: {
        text: questionText,
        choices: choices ?? undefined,
      },
      answer: {
        text: answerText,
      },
    } );
    const createdQuestionAnswerId = createdQuestionAnswer?.data?.id;

    assertDefined(createdQuestionAnswerId);

    await fetchAddQuestionAnswer(quizId, [createdQuestionAnswerId])
      .catch((error) => {
        throw error;
      } );

    await revalidateData();

    clearForm( {
      formRef: currentTarget,
    } );
  };
};

function getChoices(formData: FormData, answerText: string): ChoiceDto[] | null {
  const choices: string[] = [];
  let i = 1;

  while (true) {
    let currentChoice = formData.get(FORM_QUESTION_CHOICE_PREFIX_NAME + i);

    if (currentChoice === null || typeof currentChoice !== "string")
      break;

    if (currentChoice !== "")
      choices.push(currentChoice);

    i++;
  }

  if (choices.length === 0)
    return null;

  choices.push(answerText);

  return choices.map((text) => ( {
    text,
  } ));
}
