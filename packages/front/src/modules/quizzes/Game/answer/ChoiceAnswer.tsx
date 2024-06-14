import { TextAnswerVO } from "#shared/models/answers/text-answers/TextAnswer";
import { QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { QuestionEntity } from "#shared/models/questions/Question";
import { useEffect, useRef, useState } from "react";
import { useCheckAnswerMutation } from "../check-answer.service";
import { IAnswer, Props } from "./IAnswer";
import styles from "./styles.module.css";

const CHOICE_ANSWER_GROUP_NAME = "choice-answer";

export const ChoiceAnswer: IAnswer = ( { question, questionAnswerId, nextQuestion }: Props) => {
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

  if (!question.choices)
    return null;

  return (
    <section className={styles.answer}>
      <p>Respuesta:</p>
      <form ref={formRef} onSubmit={genOnSubmit( {
        questionAnswerId,
        checkAnswer,
      } )}>
        <article className={styles.choices}>{renderChoices(question.choices)}</article>
        <button type="submit">Enviar</button>
        {result && <p className={result.isCorrect ? styles.answerOk : styles.answerWrong}>{result.isCorrect ? "Correcto" : "Incorrecto"}</p>}
      </form>
    </section>
  );
};

export default ChoiceAnswer;

type GenOnSubmitProps = {
  questionAnswerId: QuestionAnswerID;
  checkAnswer: ReturnType<typeof useCheckAnswerMutation>[0];
};
const genOnSubmit = ( { questionAnswerId, checkAnswer }: GenOnSubmitProps) => {
  return async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const currentForm = event.currentTarget;
    const formData = new FormData(currentForm);
    const answerStr = formData.get(CHOICE_ANSWER_GROUP_NAME)?.toString();

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

type ChoicesInQuestionEntity = NonNullable<QuestionEntity["choices"]>;

function renderChoices(choices: ChoicesInQuestionEntity) {
  return choices.map(renderChoice);
}

function renderChoice(choice: ChoicesInQuestionEntity[0], index: number) {
  return <section key={index} className={styles.choice}>
    <input type="radio" name={CHOICE_ANSWER_GROUP_NAME} value={choice.text} />
    <label>{choice.text}</label>
  </section>;
}
