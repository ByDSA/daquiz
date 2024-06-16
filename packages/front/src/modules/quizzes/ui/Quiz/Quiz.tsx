import { assertDefined } from "#shared/utils/validation/asserts";
import { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { QuestionAnswerInQuizEntity, QuizEntity } from "../../models";
import { useAddQuestionAnswer, useRemoveManyQuestionAnswer, useRemoveOneQuestionAnswer } from "../../services/questions-answers-fetching/fetching.service";
import AddNewQuestionAnswer from "../questions-answers-ui/AddNewQuestionAnswer/AddNewQuestionAnswer";
import { genExpandedRow } from "./row/ExpandedRow";
import styles from "./styles.module.css";
import { TextEditableSaveable } from "#ui/TextEditable";
import { SendToButton } from "#ui/SendToButton";
import { DeleteButton } from "#ui/DeleteButton";
import { QuestionAnswerID } from "#modules/questions-answers";
import { usePatchOneQuestionAndGet } from "#modules/questions";
import { usePatchOneTextAnswerAndGet } from "#modules/answers";

type GenColumnsProps = {
  data: QuizEntity;
  revalidateData: ()=> Promise<any>;
  removeOneQuestionAnswer: ReturnType<typeof useRemoveOneQuestionAnswer>[0];
  patchOneTextAnswerAndGet: ReturnType<typeof usePatchOneTextAnswerAndGet>[0];
  patchOneQuestionAndGet: ReturnType<typeof usePatchOneQuestionAndGet>[0];
};
type GenColumnsFn = (props: GenColumnsProps)=> TableColumn<QuestionAnswerInQuizEntity>[];
const genColumns: GenColumnsFn = (
  { data,
    revalidateData,
    removeOneQuestionAnswer,
    patchOneTextAnswerAndGet,
    patchOneQuestionAndGet }: GenColumnsProps,
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

        await patchOneQuestionAndGet( {
          id: row.questionId,
          dto: {
            text: value,
          },
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

        await patchOneTextAnswerAndGet(
          {
            id: row.answerId,
            dto: {
              text: value,
            },
          },
        );

        if (row.question.choices) {
          await patchOneQuestionAndGet(
            {
              id: row.questionId,
              dto: {
                choices: [
                  ...row.question.choices.filter((choice) => choice.text !== row.answer.text),
                  {
                    text: value,
                  },
                ],
              },
            },
          );
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
        await removeOneQuestionAnswer( {
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
  const [addQuestionAnswer] = useAddQuestionAnswer();
  const [removeOneQuestionAnswer] = useRemoveOneQuestionAnswer();
  const [removeManyQuestionAnswer] = useRemoveManyQuestionAnswer();
  const [patchOneTextAnswerAndGet] = usePatchOneTextAnswerAndGet();
  const [patchOneQuestionAndGet] = usePatchOneQuestionAndGet();

  if (!data)
    return null;

  const questionsAnswersLength = questionAnswers?.length ?? 0;
  const questionsAnswersInfo = <section className={styles.resultInfo}>{questionsAnswersLength + " " + questionsLocale(questionsAnswersLength)}</section>;
  const moveTo = () => async () => {
    const questionsAnswersIds: QuestionAnswerID[] = selectedRows.map((row) => row.id);
    const targetQuizId = prompt("Introduce el id del quiz al que quieres mover las preguntas");

    if (!targetQuizId)
      return;

    await addQuestionAnswer( {
      quizId: targetQuizId,
      questionsAnswersIds,
    } );

    await removeManyQuestionAnswer( {
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
          removeOneQuestionAnswer,
          patchOneTextAnswerAndGet,
          patchOneQuestionAndGet,
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
