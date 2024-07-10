import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { ArrayAnswerVO } from "#modules/answers/models/ArrayAnswer.model";
import { ArrayPart } from "#modules/question-answer-common/models/parts/ArrayPart.model";
import { SetsPart } from "#modules/question-answer-common/models/parts/SetsPart.model";
import { QuestionAnswerVO } from "#modules/question-answers/models";
import { TextPart } from "#modules/questions/models";

it("should create the entities for this use case without errors", () => {
  const questionAnswer = plainToInstance(QuestionAnswerVO, {
    question: {
      parts: [
        {
          type: "text",
          text: "Clasifica las palabras en las categorías correctas.",
        } as TextPart,
        {
          type: "sets",
          objective: "matching",
          sets: [
            {
              content: [
                {
                  type: "text",
                  text: "Manzana",
                },
                {
                  type: "text",
                  text: "Zanahoria",
                },
                {
                  type: "text",
                  text: "Plátano",
                },
                {
                  type: "text",
                  text: "Lechuga",
                },
              ],
            },
            {
              content: [
                {
                  type: "text",
                  text: "Frutas",
                },
                {
                  type: "text",
                  text: "Verduras",
                },
              ],
            },
          ],
        } as SetsPart,
      ],
    },
    answer: {
      type: "array",
      arrayType: "set",
      content: [
        {
          type: "array",
          content: [
            {
              type: "text",
              text: "Manzana",
            },
            {
              type: "text",
              text: "Frutas",
            },
          ],
        } as ArrayPart,
        {
          type: "array",
          content: [
            {
              type: "text",
              text: "Zanahoria",
            },
            {
              type: "text",
              text: "Verduras",
            },
          ],
        } as ArrayPart,
        {
          type: "array",
          content: [
            {
              type: "text",
              text: "Plátano",
            },
            {
              type: "text",
              text: "Frutas",
            },
          ],
        } as ArrayPart,
        {
          type: "array",
          content: [
            {
              type: "text",
              text: "Lechuga",
            },
            {
              type: "text",
              text: "Verduras",
            },
          ],
        } as ArrayPart,
      ],
    } as ArrayAnswerVO,
  } );
  const errors = validateSync(questionAnswer);

  expect(errors).toEqual([]);
} );
