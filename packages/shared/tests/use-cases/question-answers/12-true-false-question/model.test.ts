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
          text: "¿Es esta pregunta verdadera?",
        } as TextPart,
        {
          type: "choices",
          choices: [
            {
              type: "text",
              text: "Verdadero",
            },
            {
              type: "text",
              text: "Falso",
            },
          ],
        } as ChoicesPart,
      ],
    },
    answer: {
      type: "text",
      text: "Verdadero",
    } as TextAnswerVO,
  } );
  const errors = validateSync(questionAnswer);

  expect(errors).toEqual([]);
} );
