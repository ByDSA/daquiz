"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { QuizList, useCreateQuizAndGet, useQuizzes } from "#modules/quizzes";

export default function Home() {
  console.log(useQuizzes);
  const { data, error, isLoading } = useQuizzes();
  const quizzes = data?.data;
  const router = useRouter();

  return (
    <main className={styles.main}>
      <h1>Quizzes</h1>

      {isLoading && <p>Loading...</p>}
      {error && <p>{error.message}</p>}
      {quizzes && <QuizList items={quizzes} onItemClick={(item) => router.push("/quizzes/" + item.id)}/>}
      <CreateQuiz/>
      <p><Link href={"/edit/quizzes"}>Edit quizzes</Link></p>
    </main>
  );
}

const CreateQuiz = () => {
  const router = useRouter();
  const [createQuiz, result] = useCreateQuizAndGet();

  if (result && result.data)
    router.push("/edit/quizzes/" + result.data.id);

  const handleClick = () => {
    const name = prompt("Enter quiz name");

    if (!name)
      return;

    createQuiz( {
      name,
    } );
  };

  return (
    <a onClick={handleClick}>Create quiz</a>
  );
};
