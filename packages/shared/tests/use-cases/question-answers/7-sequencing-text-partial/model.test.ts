import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ArrayAnswerVO } from "#modules/answers/models/ArrayAnswer.model";
import { SetsPart } from "#modules/question-answer-common/models/parts/SetsPart.model";
import { QuestionAnswerVO } from "#modules/question-answers/models";
import { TextPart } from "#modules/questions/models";

it("should create the entities for this use case without errors", async () => {
  const questionAnswer = plainToInstance(QuestionAnswerVO, {
    question: {
      parts: [
        {
          type: "text",
          text: "Ordena los planetas del Sistema Solar según su distancia al Sol",
        } as TextPart,
        {
          type: "sets",
          objective: "sequencing",
          sets: [
            {
              content: [
                {
                  type: "text",
                  text: "Mercurio",
                },
                {
                  type: "text",
                  text: "Venus",
                },
                {
                  type: "text",
                  text: "Tierra",
                },
                {
                  type: "text",
                  text: "Marte",
                },
                {
                  type: "text",
                  text: "Júpiter",
                },
                {
                  type: "text",
                  text: "Saturno",
                },
                {
                  type: "text",
                  text: "Urano",
                },
                {
                  type: "text",
                  text: "Neptuno",
                },
                {
                  type: "text",
                  text: "Plutón",
                },
                {
                  type: "text",
                  text: "Estrella Alfa Centauri",
                },
              ],
            },
          ],
        } as SetsPart,
      ],
    },
    answer: {
      type: "array",
      arrayType: "list",
      content: [
        {
          type: "text",
          text: "Mercurio",
        } as TextPart,
        {
          type: "text",
          text: "Venus",
        } as TextPart,
        {
          type: "text",
          text: "Tierra",
        } as TextPart,
        {
          type: "text",
          text: "Marte",
        } as TextPart,
        {
          type: "text",
          text: "Júpiter",
        } as TextPart,
        {
          type: "text",
          text: "Saturno",
        } as TextPart,
        {
          type: "text",
          text: "Urano",
        } as TextPart,
        {
          type: "text",
          text: "Neptuno",
        } as TextPart,
      ],
    } as ArrayAnswerVO,
  } );
  const errors = await validate(questionAnswer);

  expect(errors).toEqual([]);
} );
