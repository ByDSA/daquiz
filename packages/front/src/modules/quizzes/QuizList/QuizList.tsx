import { QuizEntity } from "#shared/models/quizzes/Quiz";
import Item from "./Item";
import styles from "./styles.module.css";

type Props = {
  items: QuizEntity[];
  onItemClick?: (item: QuizEntity, index: number, itemsArray: QuizEntity[])=> void;
};
const QuizList = ( { items, onItemClick }: Props) => {
  return (
    <>
      <section className={styles.main}>
        {
          items.map((item, i, array) => (
            <Item key={item.id}
              data={item}
              onClick={onItemClick && (()=>onItemClick(item, i, array))}
            />
          ))
        }
      </section>
    </>
  );
};

export default QuizList;
