import { QuizEntity } from "#shared/models/quizzes/Quiz";
import Item from "./Item";

type Props = {
  items: QuizEntity[];
  onItemClick?: (item: QuizEntity, index: number, itemsArray: QuizEntity[])=> void;
};
const QuizList = ( { items, onItemClick }: Props) => {
  return (
    <>
      {
        items.map((item, i, array) => (
          <Item key={item.id}
            data={item}
            onClick={onItemClick && (()=>onItemClick(item, i, array))}
          />
        ))
      }
    </>
  );
};

export default QuizList;
