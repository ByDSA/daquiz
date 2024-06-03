import { QuizEntity } from "#shared/models/quizzes/Quiz";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { QuestionAnswerCacheDocument, QuestionAnswerCacheSchema, questionAnswerCacheDocToEntity } from "./QuestionAnswerCache";

@Schema( {
  collection: "quizzes-cache",
} )
export class QuizCache {
  @Prop( {
    type: String,
    required: true,
  } )
  name: string;

  @Prop( {
    type: [QuestionAnswerCacheSchema],
    required: true,
  } )
  questionsAnswers: QuestionAnswerCacheDocument[];
}

type Doc = HydratedDocument<QuizCache>;

const SchemaOdm = SchemaFactory.createForClass(QuizCache);
const docToEntity = (doc: Doc): QuizEntity => {
  return {
    id: doc._id.toString(),
    name: doc.name,
    questionAnswersIds: doc.questionsAnswers.map((qa) => qa._id.toString()),
    questionAnswers: doc.questionsAnswers.map(questionAnswerCacheDocToEntity),
  };
};

export {
  Doc, SchemaOdm, docToEntity,
};
