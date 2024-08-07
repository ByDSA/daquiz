import { assertDefined } from "#shared/utils/validation/asserts";
import { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { QuizEntity } from "../../models";
import { useAddQuestionAnswer, useRemoveManyQuestionAnswer, useRemoveOneQuestionAnswer } from "../../services/question-answers-fetching/fetching.service";
import AddNewQuestionAnswer from "../question-answers-ui/AddNewQuestionAnswer/AddNewQuestionAnswer";
import { genExpandedRow } from "./row/ExpandedRow";
import styles from "./styles.module.css";
import { TextEditableSaveable } from "#ui/TextEditable";
import { SendToButton } from "#ui/SendToButton";
import { DeleteButton } from "#ui/DeleteButton";
import { ChoicesPart, findFirstTextPart, hasChoices, PartType, TextPart, usePatchOneQuestionAndGet } from "#modules/questions";
import { QuestionAnswerEntity, QuestionAnswerID } from "#modules/question-answers";
import { AnswerType, TextAnswerVO, usePatchOneTextAnswerAndGet } from "#modules/answers";

type GenColumnsProps = {
  data: QuizEntity;
  revalidateData: ()=> Promise<any>;
  removeOneQuestionAnswer: ReturnType<typeof useRemoveOneQuestionAnswer>[0];
  patchOneTextAnswerAndGet: ReturnType<typeof usePatchOneTextAnswerAndGet>[0];
  patchOneQuestionAndGet: ReturnType<typeof usePatchOneQuestionAndGet>[0];
};
type GenColumnsFn = (props: GenColumnsProps)=> TableColumn<QuestionAnswerEntity>[];
const genColumns: GenColumnsFn = (
  { data,
    revalidateData,
    removeOneQuestionAnswer,
    patchOneTextAnswerAndGet,
    patchOneQuestionAndGet }: GenColumnsProps,
) =>([
  {
    name: "Pregunta",
    selector: (row: QuestionAnswerEntity) => {
      let ret = findFirstTextPart(row.question)?.text ?? "(no text)";

      assertDefined(ret);

      return ret;
    },
    wrap: true,
    sortable: true,
    sortFunction: (a, b) => a.id.localeCompare(b.id),
    cell: (row: QuestionAnswerEntity) => {
      const onSave = async (value: string | undefined) => {
        if (!value)
          return;

        await patchOneQuestionAndGet( {
          id: row.id,
          dto: {
            text: value,
          },
        } );

        await revalidateData();
      };
      let text = findFirstTextPart(row.question)?.text ?? "(no text)";

      assertDefined(text);

      return <TextEditableSaveable
        initialValue={text}
        onSave={onSave}
      />;
    },
  },
  {
    name: "Respuesta",
    selector: (row: QuestionAnswerEntity) => row.answer.type === AnswerType.Text ? (row.answer as TextAnswerVO).text : "(no text)",
    wrap: true,
    cell: (row: QuestionAnswerEntity) => {
      const onSave = async (value: string | undefined) => {
        if (!value)
          return;

        await patchOneTextAnswerAndGet(
          {
            id: row.id,
            dto: {
              text: value,
            },
          },
        );

        if (hasChoices(row.question)) {
          const answerText = row.answer.type === AnswerType.Text ? (row.answer as TextAnswerVO).text : "";
          const choices = (row.question.parts.find((part) => part.type === "choices") as ChoicesPart)?.choices ?? [];
          const textChoices = choices.filter(
            (choice) => choice.type === PartType.Text,
          ) as TextPart[];
          const textChoiceToDto = (choice: TextPart) => ( {
            text: choice.text,
          } );

          await patchOneQuestionAndGet(
            {
              id: row.id,
              dto: {
                choices: [
                  ...textChoices.filter(
                    (choice) => choice.text !== answerText,
                  ).map(textChoiceToDto),
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
      const text = row.answer.type === AnswerType.Text ? (row.answer as TextAnswerVO).text : "(no text)";

      return <TextEditableSaveable
        initialValue={text}
        onSave={onSave}
      />;
    },
  },
  {
    name: "Acciones",
    cell: (row: QuestionAnswerEntity) => {
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
  const [selectedRows, setSelectedRows] = useState<QuestionAnswerEntity[]>([]);
  const questionAnswers = data?.questionAnswers;
  const filterExistingRows = (rows: QuestionAnswerEntity[]) => {
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
        selectableRowSelected={(row: QuestionAnswerEntity) => {
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
