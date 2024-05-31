import { QuestionAnswerInQuizEntity } from "#shared/models/quizzes/QuestionAnswerInQuiz";
import { QuizEntity } from "#shared/models/quizzes/Quiz";
import { ChangeEvent, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { AnswerType } from "../../../../../shared/build/models/answers/Answer";
import { neverCase } from "../../../../../shared/build/utils/typescript";
import { assertDefined } from "../../../../../shared/build/utils/validation/asserts";
import { createOneQuestionTextAnswerAndGet } from "../QuestionAnswer/fetching";
import { addQuestionAnswer, removeOneQuestionAnswer } from "../fetching";
import styles from "./styles.module.css";
import { TextEditableSaveable } from "#modules/utils/components/table/TextEditable";
import { patchOneQuestionAndGet } from "#/modules/questions";
import { patchOneTextAnswerAndGet } from "#/modules/answers";

type GenColumnsProps = {
  data: QuizEntity;
  revalidateData: ()=> Promise<any>;
};
type GenColumnsFn = (props: GenColumnsProps)=> TableColumn<QuestionAnswerInQuizEntity>[];
const genColumns: GenColumnsFn = (
  { data, revalidateData }: GenColumnsProps,
) =>([
  {
    name: "Pregunta",
    selector: (row: QuestionAnswerInQuizEntity) => {
      const ret = row.question.text;

      assertDefined(ret);

      return ret;
    },
    wrap: true,
    sortable: true,
    sortFunction: (a, b) => a.id.localeCompare(b.id),
    cell: (row: QuestionAnswerInQuizEntity) => {
      const onSave = async (value: string | undefined) => {
        if (!value)
          return;

        await patchOneQuestionAndGet(row.questionId, {
          text: value,
        } );

        await revalidateData();
      };

      return <TextEditableSaveable
        initialValue={row.question.text}
        onSave={onSave}
      />;
    },
  },
  {
    name: "Respuesta",
    selector: (row: QuestionAnswerInQuizEntity) => row.answer.text,
    wrap: true,
    cell: (row: QuestionAnswerInQuizEntity) => {
      const onSave = async (value: string | undefined) => {
        if (!value)
          return;

        await patchOneTextAnswerAndGet(row.answerId, {
          text: value,
        } );

        await revalidateData();
      };

      return <TextEditableSaveable
        initialValue={row.answer.text}
        onSave={onSave}
      />;
    },
  },
  {
    name: "Acciones",
    cell: (row: QuestionAnswerInQuizEntity) => {
      return <><button onClick={async ()=>{
        await removeOneQuestionAnswer( {
          id: data.id,
          questionAnswerId: row.id,
        } );

        await revalidateData();
      }}>Eliminar</button>
      </>;
    },
  },
]);

type Props = {
  data: QuizEntity | undefined;
  revalidateData: ()=> Promise<any>;
};
const Quiz = ( { data, revalidateData }: Props) => {
  if (!data)
    return null;

  const { questionAnswers } = data;
  const questionsAnswersLength = questionAnswers?.length ?? 0;
  const questionsAnswersInfo = <section className={styles.resultInfo}>{questionsAnswersLength + " " + questionsLocale(questionsAnswersLength)}</section>;

  return (
    <>
      {questionsAnswersInfo}
      <DataTable
        columns={genColumns( {
          data,
          revalidateData,
        } )}
        data={questionAnswers ?? []}
        pagination
        highlightOnHover
        progressPending={!questionAnswers}
        subHeader={true}
        subHeaderComponent={<p>dsdasds</p>}
        selectableRows={true}
        selectableRowsHighlight={true}
      />
      <AddNewQuestionAnswer quizId={data.id} revalidateData={revalidateData}/>
    </>
  );
};

export default Quiz;

function questionsLocale(questionsLength: number) {
  return questionsLength === 1 ? "pregunta" : "preguntas";
}

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

    await revalidateData();

    currentTarget.reset();
  };
};
