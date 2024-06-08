import { QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { QuestionAnswerInQuizEntity } from "#shared/models/quizzes/QuestionAnswerInQuiz";
import { QuizEntity } from "#shared/models/quizzes/Quiz";
import { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { assertDefined } from "../../../../../shared/build/utils/validation/asserts";
import { fetchAddQuestionAnswer, fetchRemoveManyQuestionsAnswers, fetchRemoveOneQuestionAnswer } from "../fetching";
import AddNewQuestionAnswer from "./AddNewQuestionAnswer/AddNewQuestionAnswer";
import { genExpandedRow } from "./row/ExpandedRow";
import styles from "./styles.module.css";
import { TextEditableSaveable } from "#ui/TextEditable";
import { SendToButton } from "#ui/SendToButton";
import { DeleteButton } from "#ui/DeleteButton";
import { patchOneQuestionAndGet } from "#modules/questions";
import { patchOneTextAnswerAndGet } from "#modules/answers";

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

        if (row.question.choices) {
          await patchOneQuestionAndGet(row.questionId, {
            choices: [
              ...row.question.choices.filter((choice) => choice.text !== row.answer.text),
              {
                text: value,
              },
            ],
          } );
        }

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
      return <><DeleteButton onClick={async ()=>{
        await fetchRemoveOneQuestionAnswer( {
          quizId: data.id,
          questionAnswerId: row.id,
        } );

        await revalidateData();
      }} />
      </>;
    },
  },
]);

type Props = {
  data: QuizEntity | undefined;
  revalidateData: ()=> Promise<any>;
};
const Quiz = ( { data, revalidateData }: Props) => {
  const [selectedRows, setSelectedRows] = useState<QuestionAnswerInQuizEntity[]>([]);
  const questionAnswers = data?.questionAnswers;
  const filterExistingRows = (rows: QuestionAnswerInQuizEntity[]) => {
    return rows
      .filter((selectedRow) => questionAnswers?.some((dataRow) => dataRow.id === selectedRow.id));
  };
  const fixSelectedRows = () => {
    const filteredSelectedRows = filterExistingRows(selectedRows);

    if (selectedRows.length !== filteredSelectedRows.length)
      setSelectedRows(filteredSelectedRows);
  };

  useEffect(fixSelectedRows, [data]);

  if (!data)
    return null;

  const questionsAnswersLength = questionAnswers?.length ?? 0;
  const questionsAnswersInfo = <section className={styles.resultInfo}>{questionsAnswersLength + " " + questionsLocale(questionsAnswersLength)}</section>;
  const moveTo = () => async () => {
    const questionsAnswersIds: QuestionAnswerID[] = selectedRows.map((row) => row.id);
    const targetQuizId = prompt("Introduce el id del quiz al que quieres mover las preguntas");

    if (!targetQuizId)
      return;

    await fetchAddQuestionAnswer(targetQuizId, questionsAnswersIds);

    await fetchRemoveManyQuestionsAnswers( {
      quizId: data.id,
      ids: questionsAnswersIds,
    } );

    await revalidateData();
  };

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
        subHeaderComponent={<SendToButton onClick={moveTo()} />}
        selectableRows={true}
        onSelectedRowsChange={( { selectedRows: rows } ) => {
          const filteredRows = filterExistingRows(rows);

          if (filteredRows.length !== selectedRows.length)
            setSelectedRows(filteredRows);
        }}
        selectableRowSelected={(row: QuestionAnswerInQuizEntity) => {
          return selectedRows.includes(row);
        }}
        selectableRowsHighlight
        selectableRowsVisibleOnly
        expandableRows
        expandableRowsComponent={genExpandedRow( {
          revalidateData,
        } )}
      />
      <AddNewQuestionAnswer quizId={data.id} revalidateData={revalidateData}/>
    </>
  );
};

export default Quiz;

function questionsLocale(questionsLength: number) {
  return questionsLength === 1 ? "pregunta" : "preguntas";
}
