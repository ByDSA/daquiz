import { QuestionEntity } from "#shared/models/questions/Question";
import { QuestionAnswerInQuizEntity } from "#shared/models/quizzes/QuestionAnswerInQuiz";
import Choices from "./Choices";
import styles from "./ExpandedRow.module.css";
import { patchOneQuestionAndGet } from "#/modules/questions";

type GenExpandedRow = (props: GenExpandedRowProps)=> (props: any)=> JSX.Element;
type GenExpandedRowProps = Omit<Props, "data">;
export const genExpandedRow: GenExpandedRow = ( { revalidateData } ) => {
  return ( { data } ) => {
    return <ExpandedRow data={data} revalidateData={revalidateData}/>;
  };
};

type Props = {
  data: QuestionAnswerInQuizEntity;
  revalidateData: ()=> Promise<void>;
};
const ExpandedRow = ( { data, revalidateData }: Props) => {
  const { choices: choicesInQuestion } = data.question;
  let choicesToShow = choicesInQuestion?.filter((choice) => choice.text !== data.answer.text);
  const onSave = async (value?: QuestionEntity["choices"]) => {
    if (!value)
      return;

    await patchOneQuestionAndGet(data.questionId, {
      choices: value,
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
