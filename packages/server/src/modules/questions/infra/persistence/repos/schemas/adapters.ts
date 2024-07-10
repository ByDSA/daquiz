import { model, Types } from "mongoose";
import { Choice, ChoicesPart, PartType, QuestionEntity, QuestionVO, TextPart } from "../../../../domain";
import { Choice as ChoiceDB } from "./multimedia.schema";
import { Question, QuestionDocument, QuestionSchema } from "./schema";

const choiceDocToModel = (doc: ChoiceDB): Choice => {
  if (doc.text) {
    return {
      type: PartType.Text,
      text: doc.text,
    } as TextPart;
  }

  throw new Error("Invalid choice");
};

export const docToEntity = (doc: QuestionDocument): QuestionEntity => {
  const parts: QuestionVO["parts"] = [];

  if (doc.text) {
    parts.push( {
      type: PartType.Text,
      text: doc.text,
    } as TextPart);
  }

  if (doc.choices) {
    parts.push( {
      type: PartType.Choices,
      choices: doc.choices.map(choiceDocToModel),
    } as ChoicesPart);
  }

  const entity: QuestionEntity = {
    id: "", // TODO
    parts,
  };

  return entity;
};

export const modelName = "Question";

const QuestionModel = model(modelName, QuestionSchema);

export const entityToDoc = (entity: QuestionEntity): QuestionDocument => {
  const doc: Question & {_id: any} = {
    _id: new Types.ObjectId(), // TODO
  };

  for (const part of entity.parts) {
    if (part.type === PartType.Text) {
      const parsedPart = part as TextPart;

      doc.text = parsedPart.text;
    }

    if (part.type === PartType.Choices) {
      const parsedPart = part as ChoicesPart;

      doc.choices = parsedPart.choices.map((choice) => {
        if (choice.type === PartType.Text) {
          const parsedChoice = choice as TextPart;

          return {
            text: parsedChoice.text,
          };
        }

        throw new Error("Invalid choice");
      } );
    }
  }

  return new QuestionModel(doc);
};
