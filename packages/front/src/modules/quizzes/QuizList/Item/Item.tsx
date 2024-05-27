import { QuizEntity } from "#shared/models/quizzes/Quiz";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";

type Props = {
  data: QuizEntity;
};
const Item = ( { data }: Props) => {
  const router = useRouter();
  const questionsLength = data.questionAnswers?.length ?? 0;
  const questionsNumberInfo = "(" + questionsLength + " " + (questionsLength === 1 ? "pregunta" : "preguntas") + ")";

  return (
    <article className={styles.main} onClick={() => router.push("/edit/quizzes/" + data.id)}>
      <header>{data.name}</header>
      <section>{questionsNumberInfo}</section>
    </article>
  );
};

export default Item;
