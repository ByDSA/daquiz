import { QuizID } from "#shared/models/quizzes/Quiz";
import Answer from "./Answer";
import Question from "./Question";
import { usePickQuestion } from "./picker";

type Props = {
  quizId: QuizID;
};
const Game = ( { quizId }: Props) => {
  const { questionEntity, questionAnswerId, next } = usePickQuestion( {
    quizId,
  } );

  return (
    questionEntity && questionAnswerId
    && <section>
      <Question data={questionEntity} />
      <Answer questionAnswerId={questionAnswerId} nextQuestion={next}/>
    </section>
  );
};

export default Game;
