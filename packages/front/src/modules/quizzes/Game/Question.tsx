import { QuestionEntity } from "#shared/models/questions/Question";

type Props = {
  data: QuestionEntity;
};
const Question = ( { data }: Props) => {
  return (
    <section>
      <p>Pregunta:</p>
      {data.text && <p>{data.text}</p>}
    </section>
  );
};

export default Question;
