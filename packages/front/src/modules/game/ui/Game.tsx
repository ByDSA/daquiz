import { TextAnswerVO } from "#shared/modules/answers/models";
import { useEffect, useState } from "react";
import { usePickQuestion } from "../picker";
import { useCheckAnswerMutation } from "../services";
import TextAnswer from "./InputTextAnswer";
import styles from "./styles.module.css";
import { QuizID } from "#modules/quizzes";
import { Question } from "#modules/questions";
import { useChoices } from "#/modules/questions/ui/Question/use-choices.hook";

type Props = {
  quizId: QuizID;
};
const Game = ( { quizId }: Props) => {
  const [checkAnswer, checkedResult] = useCheckAnswerMutation();
  const [result, setResult] = useState<NonNullable<typeof checkedResult> | null>(null);
  const choicesStatus = useChoices( {
    onSelected: (choice) => {
      if (choice.text) {
        const answer = {
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

  useEffect(() => {
    if (!checkedResult)
      return;

    setResult(checkedResult);
  }, [checkedResult]);
  const [currentAnswer, setCurrentAnswer] = useState<TextAnswerVO | null>(null);
  const { questionEntity, questionAnswerId, next } = usePickQuestion( {
    quizId,
  } );

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

  return (<section>
    <Question data={questionEntity} choicesStatus={choicesStatus} disabled={!!result}/>
    {!questionEntity.choices && <TextAnswer setAnswer={setCurrentAnswer} onPressEnter={check} disabled={!!result} answer={currentAnswer}/>}
    {result && <p className={result.isCorrect ? styles.answerOk : styles.answerWrong}>{result.isCorrect ? "Correcto" : "Incorrecto"}</p>}
    {!!result && <input type="button" autoFocus={true} value="Next" onClick={() => {
      setCurrentAnswer(null);
      setResult(null);
      choicesStatus?.reset();
      next();
    }}/> }
  </section>
  );
};

export default Game;
