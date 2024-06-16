import { UseChoicesRet } from "../hooks/UseChoices";
import styles from "./NewQuestion.module.css";
import { AddButton } from "#ui/AddButton";
import { DeleteButton } from "#ui/DeleteButton";

export const FORM_QUESTION_TEXT_NAME = "question-text";

export const FORM_QUESTION_CHOICE_PREFIX_NAME = "choice-";

type Props = {
  choices: UseChoicesRet;
};
const NewQuestion = ( { choices: { choices, addChoice, removeChoice, updateChoice } }: Props) => {
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
