import { QuestionEntity } from "#shared/models/questions/Question";

type Props = {
  data: QuestionEntity;
};
const Question = ( { data }: Props) => {
  return (
    <section>
      <p>Pregunta:</p>
      <p>{data.text}</p>
    </section>
  );
};

export default Question;
