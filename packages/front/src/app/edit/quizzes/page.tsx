"use client";

import styles from "./page.module.css";
import { useQuizzes } from "#/modules/quizzes/fetching";
import { QuizList } from "#modules/quizzes";

export default function Home() {
  const { data: quizzes, error } = useQuizzes();

  return (
    <main className={styles.main}>
      <h1>Quizzes</h1>

      {error && <p>{error.message}</p>}
      {quizzes && <QuizList items={quizzes} />}
    </main>
  );
}
