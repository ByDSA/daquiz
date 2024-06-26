import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { SubquizVO } from "#shared/modules/quizzes/models";
import { HydratedDocument, Types, model } from "mongoose";
// eslint-disable-next-line import/no-cycle
import { QuizCache, QuizCacheDocument, quizCacheDocToEntity, quizCacheEntityToDoc } from "./QuizCache.schema";

@Schema()
export class SubquizCache {
  _id: Types.ObjectId;

  @Prop( {
    type: Object, // No se valida schema QuizCacheSchema para evitar dependencia cíclica
    required: false,
  } )
  quiz?: QuizCache;
}

type Doc = HydratedDocument<SubquizCache>;

const SchemaOdm = SchemaFactory.createForClass(SubquizCache);
const Model = model(
  SubquizCache.name,
  SchemaOdm,
);

function docToEntity(doc: Doc): SubquizVO {
  const ret: SubquizVO = {
    id: doc._id.toString(),
  };

  if (doc.quiz)
    ret.quiz = quizCacheDocToEntity(doc.quiz as QuizCacheDocument);

  return ret;
}

function entityToDoc(entity: SubquizVO): Doc {
  const modelObj: SubquizCache = {
    _id: new Types.ObjectId(entity.id),
  };

  if (entity.quiz) {
    modelObj.quiz = quizCacheEntityToDoc( {
      id: entity.id,
      ...entity.quiz,
    } );
  }

  return new Model(modelObj);
}

export {
  Doc as SubquizCacheDocument,
  SchemaOdm as SubquizCacheSchema,
  docToEntity as subquizCacheDocToEntity,
  entityToDoc as subquizCacheEntityToDoc,
};
