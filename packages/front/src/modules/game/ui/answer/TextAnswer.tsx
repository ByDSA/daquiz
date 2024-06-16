import { useEffect, useRef, useState } from "react";
import { useCheckAnswerMutation } from "../../services/check-answer/check-answer.service";
import { IAnswer, Props } from "./IAnswer";
import styles from "./styles.module.css";
import { QuestionAnswerID } from "#modules/questions-answers";
import { TextAnswerVO } from "#modules/answers";

const TEXT_ANSWER_INPUT_NAME = "text-answer";

export const TextAnswer: IAnswer = ( { questionAnswerId, nextQuestion }: Props) => {
  const [checkAnswer, checkResult] = useCheckAnswerMutation();
  const [result, setResult] = useState<typeof checkResult>(undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (checkResult?.isCorrect) {
      formRef.current?.reset();
      nextQuestion();
      setResult(undefined);

      return;
    } else
      setResult(checkResult);
  }, [checkResult]);

  return (
    <section className={styles.answer}>
      <p>Respuesta:</p>
      <form ref={formRef} onSubmit={genOnSubmit( {
        questionAnswerId,
        checkAnswer,
      } )}>
        <input name={TEXT_ANSWER_INPUT_NAME} type="text" autoComplete="off"/>
        <button type="submit">Enviar</button>
        {result && <p className={result.isCorrect ? styles.answerOk : styles.answerWrong}>{result.isCorrect ? "Correcto" : "Incorrecto"}</p>}
      </form>
    </section>
  );
};

export default TextAnswer;

type GenOnSubmitProps = {
  questionAnswerId: QuestionAnswerID;
  checkAnswer: ReturnType<typeof useCheckAnswerMutation>[0];
};
const genOnSubmit = ( { questionAnswerId, checkAnswer }: GenOnSubmitProps) => {
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

    await checkAnswer( {
      answer,
      questionAnswerId,
    } );
  };
};
