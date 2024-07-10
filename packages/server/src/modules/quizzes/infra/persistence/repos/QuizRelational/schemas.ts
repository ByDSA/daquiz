import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { QuizEntity } from "../../../../domain";

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

  @Prop( {
    type: [Types.ObjectId],
    required: false,
  } )
  subquizzes?: Types.ObjectId[];
}

type Doc = HydratedDocument<Quiz>;

const SchemaOdm = SchemaFactory.createForClass(Quiz);
const docToEntity = (doc: Doc): QuizEntity => {
  return {
    id: doc._id.toString(),
    name: doc.name,
    questionAnswersIds: doc.questionsAnswersIds.map((qa) => qa.toString()),
    subquizzes: doc.subquizzes?.map((sq) => {
      return {
        id: sq.toString(),
      };
    } ),
  };
};

export type QuizUpdateQuery = {
  $addToSet?: {
    questionsAnswersIds?: {
      $each: Types.ObjectId[];
    };
    subquizzes?: {
      $each: Types.ObjectId[];
    };
  };
  $pull?: {
    questionsAnswersIds?: Types.ObjectId | {
      $in: Types.ObjectId[];
    };
    subquizzes?: Types.ObjectId | {
      $in: Types.ObjectId[];
    };
  };
};

export {
  Doc, docToEntity, Quiz as SchemaClass,
  SchemaOdm,
};
