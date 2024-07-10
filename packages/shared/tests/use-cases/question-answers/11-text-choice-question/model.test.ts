import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { TextAnswerVO } from "#modules/answers/models";
import { QuestionAnswerVO } from "#modules/question-answers/models";
import { ChoicesPart, TextPart } from "#modules/questions/models";

it("should create the entities for this use case without errors", () => {
  const questionAnswer = plainToInstance(QuestionAnswerVO, {
    question: {
      parts: [
        {
          type: "text",
          text: "¿Cuál es la capital de España?",
        } as TextPart,
        {
          type: "choices",
          choices: [
            {
              type: "text",
              text: "Madrid",
            },
            {
              type: "text",
              text: "Barcelona",
            },
            {
              type: "text",
              text: "Sevilla",
            },
            {
              type: "text",
              text: "Valencia",
            },
          ],
        } as ChoicesPart,
      ],
    },
    answer: {
      type: "text",
      text: "Madrid",
    } as TextAnswerVO,
  } );
  const errors = validateSync(questionAnswer);

  expect(errors).toEqual([]);
} );
