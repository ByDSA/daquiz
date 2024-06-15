"use client";

import styles from "./page.module.css";
import { useQuiz } from "#modules/quizzes";
import Game from "#modules/quizzes/Game/Game";

type Params = {
  params: {
  id: string;
  };
};

export default function Home( { params }: Params) {
  const { data, error } = useQuiz(params);
  const quiz = data?.data;

  return (
    <main className={styles.main}>
      {error && <p>{error.message}</p>}
      {
        quiz && <>
          <h1>{quiz.name}</h1>
          <Game quizId={quiz.id} />
        </>
      }
    </main>
  );
}
