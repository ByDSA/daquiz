import Choices from "./Choices";
import styles from "./ExpandedRow.module.css";
import { QuestionAnswerEntity } from "#/modules/question-answers";
import { AnswerType, TextAnswerVO } from "#modules/answers";
import { Choice, ChoicesPart, PartType, usePatchOneQuestionAndGet } from "#modules/questions";
import { ChoiceDto } from "#modules/questions/services/crud/crud.dto";

type Props = {
  data: QuestionAnswerEntity;
  revalidateData: ()=> Promise<void>;
};
type GenExpandedRowProps = Omit<Props, "data">;
type GenExpandedRow = (props: GenExpandedRowProps)=> (props: any)=> JSX.Element;
export const genExpandedRow: GenExpandedRow = ( { revalidateData } ) => {
  return ( { data } ) => {
    return <ExpandedRow data={data} revalidateData={revalidateData}/>;
  };
};

const ExpandedRow = ( { data, revalidateData }: Props) => {
  const [patchOneQuestionAndGet] = usePatchOneQuestionAndGet();
  const choicesInQuestion = (data.question.parts.find(
    (part) => part.type === PartType.Choices,
  ) as ChoicesPart | undefined)?.choices;
  const answerText = data.answer.type === AnswerType.Text ? (data.answer as TextAnswerVO).text : "";
  let choicesToShow = choicesInQuestion?.filter(
    (choice) => choice.type === PartType.Text && choice.text !== answerText,
  ) ?? [];
  const onSave = async (value?: Choice[]) => {
    if (!value)
      return;

    const valueDto: ChoiceDto[] = value.map((choice) => {
      if (choice.type === PartType.Text) {
        return {
          text: choice.text,
        };
      }

      return undefined;
    } ).filter((choice) => choice !== undefined) as ChoiceDto[];
    const choicesDto = [
      ...valueDto,
      {
        text: answerText,
      },
    ];

    await patchOneQuestionAndGet( {
      id: data.id,
      dto: {
        choices: choicesDto,
      },
    } );

    await revalidateData();
  };

  return (
    <section className={styles.main}>
      <Choices initChoices={choicesToShow} onSave={onSave}/>
    </section>
  );
};

export default ExpandedRow;
