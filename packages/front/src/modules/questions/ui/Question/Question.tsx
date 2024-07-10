import Choices from "./Choices";
import { useChoices } from "./use-choices.hook";
import { ChoicesPart, PartType, QuestionVO, TextPart } from "#modules/questions";

type Props = {
  data: QuestionVO;
  disabled?: boolean;
  choicesStatus?: ReturnType<typeof useChoices>;
};
const Question = ( { data, choicesStatus, disabled }: Props) => {
  const parts = [];

  for (let i = 0; i < data.parts.length; i++) {
    const part = data.parts[i];

    if (part.type === PartType.Choices) {
      const parsedPart = part as ChoicesPart;
      const choicesData = parsedPart.choices;
      const el = Choices( {
        data: choicesData,
        disabled,
        ...choicesStatus,
      } );

      parts.push(el);
    } else if (part.type === PartType.Text) {
      const parsedPart = part as TextPart;

      parts.push(<p key={i + part.type}>{parsedPart.text}</p>);
    }
  }

  return (
    <section>
      <p>Pregunta:</p>
      {parts}
    </section>
  );
};

export default Question;
