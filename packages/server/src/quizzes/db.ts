import { QuizEntity } from "#shared/models/quizzes/Quiz";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { QuestionAnswerDocument, QuestionAnswerSchema, questionAnswerDocumentToEntity } from "#/questions-answers/db/schemas";

@Schema( {
  collection: "quizzes",
} )
export class Quiz {
  @Prop( {
    type: [QuestionAnswerSchema],
    required: true,
  } )
  questionsAnswers: QuestionAnswerDocument[];
}

export type QuizDocument = HydratedDocument<Quiz>;

export const QuizSchema = SchemaFactory.createForClass(Quiz);

export const quizDocumentToEntity = (doc: QuizDocument): QuizEntity => {
  return {
    // eslint-disable-next-line no-underscore-dangle
    id: doc._id.toString(),
    // eslint-disable-next-line no-underscore-dangle
    questionAnswersIds: doc.questionsAnswers.map((qa) => qa._id.toString()),
    questionAnswers: doc.questionsAnswers.map(questionAnswerDocumentToEntity),
  };
};
