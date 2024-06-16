import { usePickQuestion } from "../picker";
import Question from "./Question";
import ChoiceAnswer from "./answer/ChoiceAnswer";
import { IAnswer } from "./answer/IAnswer";
import TextAnswer from "./answer/TextAnswer";
import { QuizID } from "#modules/quizzes";
import { QuestionEntity } from "#modules/questions";

type Props = {
  quizId: QuizID;
};
const Game = ( { quizId }: Props) => {
  const { questionEntity, questionAnswerId, next } = usePickQuestion( {
    quizId,
  } );

  if (!questionEntity || !questionAnswerId)
    return null;

  const Answer = getAnswerComponent( {
    question: questionEntity,
  } );

  return (<section>
    <Question data={questionEntity} />
    <Answer questionAnswerId={questionAnswerId} question={questionEntity} nextQuestion={next}/>
  </section>
  );
};

type GetAnswerComponentProps = {
  question: QuestionEntity;
};
function getAnswerComponent( { question }: GetAnswerComponentProps): IAnswer {
  if (question.choices)
    return ChoiceAnswer;

  return TextAnswer;
}

export default Game;