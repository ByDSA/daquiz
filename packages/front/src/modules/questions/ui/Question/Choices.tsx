import { EventHandler } from "react";
import { Choice, PartType } from "../../models";
import styles from "./Choices.module.css";
import { UseChoicesRet } from "./use-choices.hook";

type ChoicesInQuestionEntity = Choice[];

type Props = Partial<UseChoicesRet> & {
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
          const value: string | undefined = (() => {
            if (choice.type === PartType.Text)
              return choice.text;

            return undefined;
          } )();

          return (
            <section key={index} className={styles.choice}>
              <input type="radio" value={value} checked={checked} onChange={handleOnClick} disabled={disabled}/>
              <label onClick={!checked && !disabled ? handleOnClick : undefined}>{value}</label>
            </section>
          );
        } )
      }
    </article>);
};

export default Choices;
