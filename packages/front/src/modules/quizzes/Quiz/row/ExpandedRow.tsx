import { QuestionEntity } from "#shared/models/questions/Question";
import { QuestionAnswerInQuizEntity } from "#shared/models/quizzes/QuestionAnswerInQuiz";
import Choices from "./Choices";
import styles from "./ExpandedRow.module.css";
import { usePatchOneQuestionAndGet } from "#modules/questions";

type Props = {
  data: QuestionAnswerInQuizEntity;
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
  const { choices: choicesInQuestion } = data.question;
  let choicesToShow = choicesInQuestion?.filter((choice) => choice.text !== data.answer.text);
  const onSave = async (value?: QuestionEntity["choices"]) => {
    if (!value)
      return;

    const choicesDto = [
      ...value,
      {
        text: data.answer.text,
      },
    ];

    await patchOneQuestionAndGet( {
      id: data.questionId,
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
