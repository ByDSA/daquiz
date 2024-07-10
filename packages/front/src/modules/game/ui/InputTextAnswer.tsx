import { EventHandler } from "react";
import { AnswerType, TextAnswerVO } from "#modules/answers";

export type Props = {
  setAnswer: (answer: TextAnswerVO | null)=> void;
  answer: TextAnswerVO | null;
  onPressEnter?: ()=> void;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
};

export const TextAnswer = ( { answer, setAnswer, onPressEnter, disabled, inputRef }: Props) => {
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
      <input type="text" ref={inputRef} autoFocus={true} autoComplete="off" onKeyDown={handleOnKeyDown} onChange={(event) =>{
        setAnswer( {
          type: AnswerType.Text,
          text: event.target.value,
        } );
      }} disabled={disabled} value={answer?.text ?? ""}/>
    </section>
  );
};

export default TextAnswer;
