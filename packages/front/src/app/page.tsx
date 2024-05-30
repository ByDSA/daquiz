"use client";

import { CreateQuizDto } from "#shared/models/quizzes/dtos";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { assertDefined } from "../../../shared/build/utils/validation/asserts";
import styles from "./page.module.css";
import { QuizList, fetchCreateQuizAndGet, useQuizzes } from "#modules/quizzes";

export default function Home() {
  const { data: quizzes, error } = useQuizzes();
  const router = useRouter();

  return (
    <main className={styles.main}>
      <h1>Quizzes</h1>

      {error && <p>{error.message}</p>}
      {quizzes && <QuizList items={quizzes} onItemClick={(item) => router.push("/quizzes/" + item.id)}/>}
      <CreateQuiz/>
      <p><Link href={"/edit/quizzes"}>Edit quizzes</Link></p>
    </main>
  );
}

const CreateQuiz = () => {
  const router = useRouter();
  const genClickHandler = () => async () => {
    const name = prompt("Enter quiz name");

    if (!name)
      return;

    const dto: CreateQuizDto = {
      name,
    };
    const response = await fetchCreateQuizAndGet(dto);
    const quiz = response.data;

    assertDefined(quiz);

    router.push("/edit/quizzes/" + quiz.id);
  };

  return (
    <a onClick={genClickHandler()}>Create quiz</a>
  );
};
