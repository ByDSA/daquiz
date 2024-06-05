import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, UpdateQuery } from "mongoose";
import { QuizEntity, QuizUpdateEntity } from "../../../domain";

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
  questionsAnswers: Types.ObjectId[];
}

type Doc = HydratedDocument<Quiz>;

const SchemaOdm = SchemaFactory.createForClass(Quiz);
const docToEntity = (doc: Doc): QuizEntity => {
  return {
    id: doc._id.toString(),
    name: doc.name,
    questionAnswersIds: doc.questionsAnswers.map((qa) => qa.toString()),
  };
};
const updateQueryToUpdateEntity = (
  updateQuery: UpdateQuery<Doc>,
): QuizUpdateEntity => {
  const updateEntity: QuizUpdateEntity = {};

  if (updateQuery.name)
    updateEntity.name = updateQuery.name;

  const { $addToSet, $pull } = updateQuery;

  if ($addToSet?.questionsAnswers) {
    updateEntity.questionAnswersIds = {};

    if ($addToSet.questionsAnswers)
      updateEntity.questionAnswersIds.added = $addToSet.questionsAnswers.$each.map(a=>a.toString());
  }

  if ($pull?.questionsAnswers) {
    updateEntity.questionAnswersIds ??= {};

    updateEntity.questionAnswersIds.removed ??= [];

    if (typeof $pull?.questionsAnswers === "string")
      updateEntity.questionAnswersIds.removed.push($pull.questionsAnswers);
    else if (Array.isArray($pull.questionsAnswers.$in))
      updateEntity.questionAnswersIds.removed.push(...$pull.questionsAnswers.$in);
  }

  return updateEntity;
};

export {
  Doc,
  SchemaOdm,
  docToEntity,
  updateQueryToUpdateEntity,
};
