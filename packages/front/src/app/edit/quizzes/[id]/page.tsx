"use client";

import styles from "./page.module.css";
import { Quiz, useQuiz } from "#modules/quizzes";

type Params = {
  params: {
  id: string;
  };
};
export default function Page( { params }: Params) {
  const { data: quiz, error } = useQuiz(params.id);

  return (
    <main className={styles.main}>
      {error && <p>{error.message}</p>}
      {
        quiz && <>
          <h1>{quiz.name}</h1>
          <Quiz data={quiz} />
        </>
      }
    </main>
  );
}
