import { QuizEntity } from "#shared/models/quizzes/Quiz";
import styles from "./styles.module.css";
import { classNames } from "#/modules/utils/styling";

type Props = {
  data: QuizEntity;
  onClick?: ()=> void;
};
const Item = ( { data, onClick }: Props) => {
  const questionsLength = data.questionAnswers?.length ?? 0;
  const questionsNumberInfo = "(" + questionsLength + " " + (questionsLength === 1 ? "pregunta" : "preguntas") + ")";

  return (
    <article className={classNames(styles.main, onClick && styles.clickable)} onClick={onClick}>
      <header>{data.name}</header>
      <section>{questionsNumberInfo}</section>
    </article>
  );
};

export default Item;
