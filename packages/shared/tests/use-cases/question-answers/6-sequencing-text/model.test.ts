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
          text: "Ordena los eventos históricos cronológicamente",
        } as TextPart,
        {
          type: "sets",
          objective: "sequencing",
          sets: [
            {
              content: [
                {
                  type: "text",
                  text: "Primera Guerra Mundial",
                },
                {
                  type: "text",
                  text: "Descubrimiento de América",
                },
                {
                  type: "text",
                  text: "Revolución Francesa",
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
          text: "Descubrimiento de América",
        } as TextPart,
        {
          type: "text",
          text: "Revolución Francesa",
        } as TextPart,
        {
          type: "text",
          text: "Primera Guerra Mundial",
        } as TextPart,
      ],
    } as ArrayAnswerVO,
  } );
  const errors = await validate(questionAnswer);

  expect(errors).toEqual([]);
} );
