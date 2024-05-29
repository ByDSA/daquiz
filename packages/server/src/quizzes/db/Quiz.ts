import { QuizEntity } from "#shared/models/quizzes/Quiz";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { QuestionAnswerInQuizDocument, QuestionAnswerInQuizSchema, docToEntity as questionAnswerInQuizDocToEntity } from "./QuestionAnswerInQuiz";

@Schema( {
  collection: "quizzes",
} )
export class Quiz {
  @Prop( {
    type: String,
    required: true,
  } )
  name: string;

  @Prop( {
    type: [QuestionAnswerInQuizSchema],
    required: true,
  } )
  questionsAnswers: QuestionAnswerInQuizDocument[];
}

export type QuizDocument = HydratedDocument<Quiz>;

export const QuizSchema = SchemaFactory.createForClass(Quiz);

export const docToEntity = (doc: QuizDocument): QuizEntity => {
  return {
    // eslint-disable-next-line no-underscore-dangle
    id: doc._id.toString(),
    name: doc.name,
    // eslint-disable-next-line no-underscore-dangle
    questionAnswersIds: doc.questionsAnswers.map((qa) => qa._id.toString()),
    questionAnswers: doc.questionsAnswers.map(questionAnswerInQuizDocToEntity),
  };
};
