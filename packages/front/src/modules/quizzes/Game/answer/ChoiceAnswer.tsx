import { TextAnswerVO } from "#shared/models/answers/text-answers/TextAnswer";
import { QuestionAnswerID } from "#shared/models/questions-answers/QuestionAnswer";
import { QuestionEntity } from "#shared/models/questions/Question";
import { useState } from "react";
import { CheckAnswerResult, fetchCheckAnswer } from "../fetching";
import { IAnswer, Props } from "./IAnswer";
import styles from "./styles.module.css";

const CHOICE_ANSWER_GROUP_NAME = "choice-answer";

export const ChoiceAnswer: IAnswer = ( { question, questionAnswerId, nextQuestion }: Props) => {
  const [result, setResult] = useState<CheckAnswerResult | null>(null);

  if (!question.choices)
    return null;

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
        <article className={styles.choices}>{renderChoices(question.choices)}</article>
        <button type="submit">Enviar</button>
        {result && <p className={result.isCorrect ? styles.answerOk : styles.answerWrong}>{result.isCorrect ? "Correcto" : "Incorrecto"}</p>}
      </form>
    </section>
  );
};

export default ChoiceAnswer;

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
    const answerStr = formData.get(CHOICE_ANSWER_GROUP_NAME)?.toString();

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
