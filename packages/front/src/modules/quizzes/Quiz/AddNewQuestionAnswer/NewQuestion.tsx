import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./NewQuestion.module.css";
import { DeleteButton } from "#ui/DeleteButton";
import { AddButton } from "#ui/AddButton";

export const FORM_QUESTION_TEXT_NAME = "question-text";

export const FORM_QUESTION_CHOICE_PREFIX_NAME = "choice-";

const NewQuestion = () => {
  const { choices, addChoice, removeChoice, updateChoice } = useChoices();

  return (
    <section>
      <input type="text" placeholder="Pregunta" name={FORM_QUESTION_TEXT_NAME}/>
      <p>Choices:</p>
      <article className={styles.choices}>
        {choices.map((choice, i) => (
          <div key={choice.id} className={styles.choice}>
            <input type="text" placeholder="Choice" name={`${FORM_QUESTION_CHOICE_PREFIX_NAME}${i + 1}`} value={choice.text} onChange={
              (event) => {
                updateChoice(i, event.target.value);
              }
            }/>
            <DeleteButton onClick={() => removeChoice(i)}/>
          </div>
        ))}
      </article>
      <AddButton onClick={addChoice}/>
    </section>
  );
};

export default NewQuestion;

type Choice = {
  id: string;
  text: string;
};
function useChoices() {
  const [choices, setChoices] = useState<Choice[]>([]);
  const addChoice = () => setChoices([...choices, {
    id: uuidv4(),
    text: "",
  }]);

  return {
    choices,
    addChoice,
    removeChoice: (index: number) => {
      const newChoices = [...choices];

      newChoices.splice(index, 1);
      setChoices(newChoices);
    },
    updateChoice: (index: number, text: string) => {
      const newChoices = [...choices];

      newChoices[index] = {
        ...newChoices[index],
        text,
      };
      setChoices(newChoices);
    },
  };
}
