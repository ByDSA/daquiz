import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, model } from "mongoose";
import { QuizEntity } from "../../../domain";
import { QuestionAnswerCacheDocument, QuestionAnswerCacheSchema, questionAnswerCacheDocToEntity, questionAnswerCacheEntityToDoc } from "./QuestionAnswerCache";

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
const ModelOdm = model(QuizCache.name, SchemaOdm);
const docToEntity = (doc: Doc): QuizEntity => {
  return {
    id: doc._id.toString(),
    name: doc.name,
    questionAnswersIds: doc.questionsAnswers.map((qa) => qa._id.toString()),
    questionAnswers: doc.questionsAnswers.map(questionAnswerCacheDocToEntity),
  };
};
const entityToDoc = (entity: QuizEntity): Doc => {
  const ret = new ModelOdm( {
    _id: new Types.ObjectId(entity.id),
    name: entity.name,
    questionsAnswers: entity.questionAnswers?.map(questionAnswerCacheEntityToDoc),
  } );

  return ret;
};

export {
  Doc as QuizCacheDocument,
  SchemaOdm as QuizCacheSchema,
  docToEntity as quizCacheDocToEntity,
  entityToDoc as quizCacheEntityToDoc,
};
