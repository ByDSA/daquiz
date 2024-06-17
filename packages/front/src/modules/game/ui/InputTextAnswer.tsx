import { EventHandler } from "react";
import { TextAnswerVO } from "#modules/answers";

export type Props = {
  setAnswer: (answer: TextAnswerVO | null)=> void;
  answer: TextAnswerVO | null;
  onPressEnter?: ()=> void;
  disabled?: boolean;
};

export const TextAnswer = ( { answer, setAnswer, onPressEnter, disabled }: Props) => {
  let handleOnKeyDown: EventHandler<any> | undefined;

  if (onPressEnter) {
    handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onPressEnter();
      }
    };
  }

  return (
    <section>
      <p>Respuesta:</p>
      <input type="text" autoComplete="off" onKeyDown={handleOnKeyDown} onChange={(event) =>{
        setAnswer( {
          text: event.target.value,
        } );
      }} disabled={disabled} value={answer?.text ?? ""}/>
    </section>
  );
};

export default TextAnswer;
