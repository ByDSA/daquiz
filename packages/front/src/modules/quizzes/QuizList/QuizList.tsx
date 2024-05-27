import { QuizEntity } from "#shared/models/quizzes/Quiz";
import Item from "./Item";

type Props = {
  items: QuizEntity[];
};
const QuizList = ( { items }: Props) => {
  return (
    <>
      {
        items.map((item) => (
          <Item key={item.id} data={item} />
        ))
      }
    </>
  );
};

export default QuizList;
