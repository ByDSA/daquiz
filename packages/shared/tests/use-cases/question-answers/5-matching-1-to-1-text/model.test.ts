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
          text: "Empareja los países con sus capitales",
        } as TextPart,
        {
          type: "sets",
          objective: "matching",
          sets: [
            {
              content: [
                {
                  type: "text",
                  text: "España",
                },
                {
                  type: "text",
                  text: "Francia",
                },
                {
                  type: "text",
                  text: "Alemania",
                },
              ],
            },
            {
              content: [
                {
                  type: "text",
                  text: "Madrid",
                },
                {
                  type: "text",
                  text: "París",
                },
                {
                  type: "text",
                  text: "Berlín",
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
              text: "España",
            },
            {
              type: "text",
              text: "Madrid",
            },
          ],
        } as ArrayPart,
        {
          type: "array",
          content: [
            {
              type: "text",
              text: "Francia",
            },
            {
              type: "text",
              text: "París",
            },
          ],
        } as ArrayPart,
        {
          type: "array",
          content: [
            {
              type: "text",
              text: "Alemania",
            },
            {
              type: "text",
              text: "Berlín",
            },
          ],
        } as ArrayPart,
      ],
    } as ArrayAnswerVO,
  } );
  const errors = validateSync(questionAnswer);

  expect(errors.length).toBe(0);
} );
