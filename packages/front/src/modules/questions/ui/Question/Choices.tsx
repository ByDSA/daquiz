import { EventHandler } from "react";
import { QuestionEntity } from "../../models";
import styles from "./Choices.module.css";
import { UseChoicesRet } from "./use-choices.hook";

type ChoicesInQuestionEntity = NonNullable<QuestionEntity["choices"]>;

type Props = UseChoicesRet & {
  data: ChoicesInQuestionEntity;
  disabled?: boolean;
};
const Choices = ( { data, selectedIndex, onClickEach, disabled }: Props) => {
  return (
    <article className={styles.choices}>
      <p>Opciones:</p>
      {
        data.map((choice, index) => {
          const checked = index === selectedIndex;
          const handleOnClick: EventHandler<any> = (_event) => {
            onClickEach?.(data[index], index);
          };

          return (
            <section key={index} className={styles.choice}>
              <input type="radio" value={choice.text} checked={checked} onChange={handleOnClick} disabled={disabled}/>
              <label onClick={!checked && !disabled ? handleOnClick : undefined}>{choice.text}</label>
            </section>
          );
        } )
      }
    </article>);
};

export default Choices;
