"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { QuizList, useQuizzes } from "#modules/quizzes";

export default function Home() {
  const { data: quizzes, error } = useQuizzes();
  const router = useRouter();

  return (
    <main className={styles.main}>
      <h1>Quizzes</h1>

      {error && <p>{error.message}</p>}
      {quizzes && <QuizList items={quizzes} onItemClick={(item) => router.push("/quizzes/" + item.id)}/>}
      <p><Link href={"/edit/quizzes"}>Edit quizzes</Link></p>
    </main>
  );
}
