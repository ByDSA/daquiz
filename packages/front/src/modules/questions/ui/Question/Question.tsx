import Choices from "./Choices";
import { useChoices } from "./use-choices.hook";
import { QuestionEntity } from "#modules/questions";

type Props = {
  data: QuestionEntity;
  disabled?: boolean;
  choicesStatus?: ReturnType<typeof useChoices>;
};
const Question = ( { data, choicesStatus, disabled }: Props) => {
  let choices = null;

  if (data.choices && choicesStatus) {
    choices = Choices( {
      data: data.choices,
      disabled,
      ...choicesStatus,
    } );
  }

  return (
    <section>
      <p>Pregunta:</p>
      {data.text && <p>{data.text}</p>}
      {choices}
    </section>
  );
};

export default Question;
