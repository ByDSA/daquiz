"use client";

import styles from "./page.module.css";
import { Quiz, useQuiz } from "#modules/quizzes";

type Params = {
  params: {
  id: string;
  };
};
export default function Page( { params }: Params) {
  const { data, error, revalidate } = useQuiz(params);
  const quiz = data?.data;
  // eslint-disable-next-line require-await
  const revalidateDelayed = async () => {
    // Se usa delay para que dé tiempo a actualizar en tabla de lectura
    setTimeout(()=>revalidate(), 10);
  };

  return (
    <main className={styles.main}>
      {error && <p>{error.message}</p>}
      {
        quiz && <>
          <h1>{quiz.name}</h1>
          <Quiz data={quiz} revalidateData={revalidateDelayed}/>
        </>
      }
    </main>
  );
}
