import { AnswerType, TextAnswerVO } from "#shared/modules/answers/models";
import { useEffect, useRef, useState } from "react";
import { usePickQuestion } from "../picker";
import { useCheckAnswerMutation } from "../services";
import TextAnswer from "./InputTextAnswer";
import styles from "./styles.module.css";
import { QuizID } from "#modules/quizzes";
import { useChoices } from "#modules/questions/ui/Question/use-choices.hook";
import { PartType, Question } from "#modules/questions";

type Props = {
  quizId: QuizID;
};
const Game = ( { quizId }: Props) => {
  const [checkAnswer, checkedResult] = useCheckAnswerMutation();
  const [result, setResult] = useState<NonNullable<typeof checkedResult> | null>(null);
  const choicesStatus = useChoices( {
    onSelected: (choice) => {
      if (choice.type === PartType.Text) {
        const answer: TextAnswerVO = {
          type: AnswerType.Text,
          text: choice.text,
        };

        setCurrentAnswer(answer);

        if (!questionAnswerId)
          return;

        checkAnswer( {
          questionAnswerId,
          answer,
        } );
      }
    },

  } );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!checkedResult)
      return;

    setResult(checkedResult);
  }, [checkedResult]);
  const [currentAnswer, setCurrentAnswer] = useState<TextAnswerVO | null>(null);
  const { questionEntity, questionAnswerId, next } = usePickQuestion( {
    quizId,
  } );

  useEffect(() => {
    inputRef.current?.focus();
  }, [questionEntity]);

  if (!questionEntity || !questionAnswerId)
    return null;

  const check = async () => {
    if (!currentAnswer)
      return;

    await checkAnswer( {
      questionAnswerId,
      answer: currentAnswer,
    } );
  };
  let hasChoices = false;

  for (const part of questionEntity.parts) {
    if (part.type === PartType.Choices) {
      hasChoices = true;
      break;
    }
  }

  return (<section>
    <Question data={questionEntity} choicesStatus={choicesStatus} disabled={!!result}/>
    {
      !hasChoices
      && <TextAnswer
        setAnswer={setCurrentAnswer}
        onPressEnter={check}
        disabled={!!result}
        inputRef={inputRef}
        answer={currentAnswer}/>
    }
    {result && <p className={result.isCorrect ? styles.answerOk : styles.answerWrong}>{result.isCorrect ? "Correcto" : "Incorrecto"}</p>}
    {!!result && <input type="button" autoFocus={true} value="Next" onClick={() => {
      setCurrentAnswer(null);
      setResult(null);
      choicesStatus?.reset();
      next();
    }}/> }
    {result
    && !result.isCorrect
    && result.correctAnswers
    && getCorrectAnswersView(result.correctAnswers)}
  </section>
  );
};

function getCorrectAnswersView(correctAnswers: string[]) {
  const ps = correctAnswers.map((correctAnswer, index) => {
    return <p key={index}>{correctAnswer}</p>;
  } );

  return <>
    <p>Correct answer{correctAnswers.length > 1 ? "s" : ""}:</p>
    {ps}
  </>;
}

export default Game;
