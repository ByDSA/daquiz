import { TextAnswerVO } from "#shared/models/answers/text-answers/TextAnswer";
import { QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { useState } from "react";
import { CheckAnswerResult, fetchCheckAnswer } from "../fetching";
import { IAnswer, Props } from "./IAnswer";
import styles from "./styles.module.css";

const TEXT_ANSWER_INPUT_NAME = "text-answer";

export const TextAnswer: IAnswer = ( { questionAnswerId, nextQuestion }: Props) => {
  const [result, setResult] = useState<CheckAnswerResult | null>(null);

  return (
    <section className={styles.answer}>
      <p>Respuesta:</p>
      <form onSubmit={genOnSubmit( {
        questionAnswerId,
        onCheckResult: ( { result: r, form } ) => {
          if (r.isCorrect) {
            setResult(null);
            form.reset();
            nextQuestion();

            return;
          }

          setResult(r);
        },
      } )}>
        <input name={TEXT_ANSWER_INPUT_NAME} type="text" autoComplete="off"/>
        <button type="submit">Enviar</button>
        {result && <p className={result.isCorrect ? styles.answerOk : styles.answerWrong}>{result.isCorrect ? "Correcto" : "Incorrecto"}</p>}
      </form>
    </section>
  );
};

export default TextAnswer;

type OnCheckResultProps = {
  result: CheckAnswerResult;
  form: HTMLFormElement;
};

type GenOnSubmitProps = {
  questionAnswerId: QuestionAnswerID;
  onCheckResult?: (props: OnCheckResultProps)=> void;
};
const genOnSubmit = ( { questionAnswerId, onCheckResult }: GenOnSubmitProps) => {
  return async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const currentForm = event.currentTarget;
    const formData = new FormData(currentForm);
    const answerStr = formData.get(TEXT_ANSWER_INPUT_NAME)?.toString();

    if (!answerStr)
      return;

    const answer: TextAnswerVO = {
      text: answerStr,
    };
    const checkResult = await fetchCheckAnswer( {
      answer,
      questionAnswerId,
    } );

    onCheckResult?.( {
      result: checkResult,
      form: currentForm,
    } );
  };
};
