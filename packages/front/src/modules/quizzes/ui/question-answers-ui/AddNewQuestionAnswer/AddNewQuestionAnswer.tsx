import { neverCase } from "#shared/utils/typescript";
import { assertDefined } from "#shared/utils/validation/asserts";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import NewQuestion, { FORM_QUESTION_CHOICE_PREFIX_NAME, FORM_QUESTION_TEXT_NAME } from "./NewQuestion/NewQuestion";
import { useChoices } from "./hooks/UseChoices";
import styles from "./styles.module.css";
import { useAddQuestionAnswer } from "#modules/quizzes/services";
import { Choice, ChoicesPart, PartType, QuestionVO, TextPart } from "#modules/questions";
import { useCreateOneQuestionAnswerAndGet } from "#modules/question-answers";
import { AnswerType, TextAnswerVO } from "#modules/answers";

type AddNewQuestionAnswerProps = {
  quizId: string;
  revalidateData: ()=> Promise<any>;
};
const AddNewQuestionAnswer = ( { quizId, revalidateData }: AddNewQuestionAnswerProps) => {
  const [answerType, setAnswerType] = useState(AnswerType.Text);
  const formRef = useRef<HTMLFormElement>(null);
  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAnswerType(event.target.value as AnswerType);
  };
  const { choices, addChoice, removeChoice, updateChoice, clearAllChoices } = useChoices();
  const clearForm = () => {
    if (!formRef.current)
      return;

    formRef.current.reset();
    clearAllChoices();
  };
  const [addQuestionAnswer] = useAddQuestionAnswer();
  const [
    createOneQuestionAnswerAndGet,
    createdQuestionAnswer,
  ] = useCreateOneQuestionAnswerAndGet();

  useEffect(() => {
    if (!createdQuestionAnswer)
      return;

    (async () => {
      const createdQuestionAnswerId = createdQuestionAnswer.data?.id;

      assertDefined(createdQuestionAnswerId);

      await addQuestionAnswer( {
        quizId,
        questionsAnswersIds: [createdQuestionAnswerId],
      } )
        .catch((error) => {
          throw error;
        } );

      await revalidateData();

      clearForm();
    } )();
  }, [createdQuestionAnswer]);

  return (<section className={styles.addNewSection}>
    <h2>Añadir nueva pregunta:</h2>
    <form ref={formRef} onSubmit={genOnSubmitHandler( {
      createOneQuestionAnswerAndGet: createOneQuestionAnswerAndGet,
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
    case AnswerType.Text:
      return "Texto";
    case AnswerType.Set:
      return "Set";
    default:
      return neverCase(answerType);
  }
};
const inputsByAnswerType = (answerType: AnswerType) => {
  switch (answerType) {
    case AnswerType.Text:
      return <input type="text" placeholder="Respuesta" name="answer-text"/>;
    case AnswerType.Set:
      throw new Error("Not implemented"); // TODO
    default:
      return neverCase(answerType);
  }
};

type GenOnSubmitHandlerProps = {
  createOneQuestionAnswerAndGet: ReturnType<typeof useCreateOneQuestionAnswerAndGet>[0];
};
const genOnSubmitHandler = ( { createOneQuestionAnswerAndGet }: GenOnSubmitHandlerProps) => {
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
    const question: QuestionVO = {
      parts: [],
    };

    if (questionText) {
      question.parts.push( {
        type: PartType.Text,
        text: questionText,
      } as TextPart);
    }

    if (choices) {
      question.parts.push( {
        type: PartType.Choices,
        choices,
      } as ChoicesPart);
    }

    await createOneQuestionAnswerAndGet( {
      question,
      answer: {
        type: AnswerType.Text,
        text: answerText,
      } as TextAnswerVO,
    } );
  };
};

function getChoices(formData: FormData, answerText: string): Choice[] | null {
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
    type: PartType.Text,
    text,
  } as TextPart));
}
