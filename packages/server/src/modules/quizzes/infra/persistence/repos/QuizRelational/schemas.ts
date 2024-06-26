import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, UpdateQuery } from "mongoose";
import { QuizEntity, QuizUpdateEntity } from "../../../../domain";
import { questionAnswerCacheDocToEntity } from "../QuizCache";

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
    type: [Types.ObjectId],
    required: true,
  } )
  questionsAnswersIds: Types.ObjectId[];
}

type Doc = HydratedDocument<Quiz>;

const SchemaOdm = SchemaFactory.createForClass(Quiz);
const docToEntity = (doc: Doc): QuizEntity => {
  return {
    id: doc._id.toString(),
    name: doc.name,
    questionAnswersIds: doc.questionsAnswersIds.map((qa) => qa.toString()),
  };
};
const updateQueryToUpdateEntity = (
  updateQuery: UpdateQuery<Doc>,
): QuizUpdateEntity => {
  const updateEntity: QuizUpdateEntity = {};

  if (updateQuery.name)
    updateEntity.name = updateQuery.name;

  const { $addToSet, $pull } = updateQuery;

  if ($addToSet?.questionsAnswersIds) {
    updateEntity.questionAnswersIds = {};

    if ($addToSet.questionsAnswersIds) {
      updateEntity.questionAnswersIds.added = $addToSet.questionsAnswersIds.$each
        .map(a=>a.toString());
    }
  }

  if ($addToSet?.questionsAnswers) {
    updateEntity.questionAnswers = {};

    if ($addToSet.questionsAnswers) {
      updateEntity.questionAnswers.added = $addToSet.questionsAnswers.$each
        .map(questionAnswerCacheDocToEntity);
    }
  }

  if ($pull?.questionsAnswersIds) {
    updateEntity.questionAnswersIds ??= {};

    updateEntity.questionAnswersIds.removed ??= [];

    if (typeof $pull?.questionsAnswersIds === "string")
      updateEntity.questionAnswersIds.removed.push($pull.questionsAnswersIds);
    else if (Array.isArray($pull.questionsAnswersIds.$in))
      updateEntity.questionAnswersIds.removed.push(...$pull.questionsAnswersIds.$in);
  }

  if ($pull?.questionsAnswers) {
    updateEntity.questionAnswersIds ??= {};

    updateEntity.questionAnswersIds.removed ??= [];

    if (Array.isArray($pull.questionsAnswers._id.$in)) {
      updateEntity.questionAnswersIds.removed.push(...$pull.questionsAnswers._id.$in
        .map(a=>a.toString()));
    }
  }

  return updateEntity;
};

export {
  Doc,
  Quiz as SchemaClass,
  SchemaOdm,
  docToEntity,
  updateQueryToUpdateEntity,
};
