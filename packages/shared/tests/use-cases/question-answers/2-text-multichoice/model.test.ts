import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ArrayAnswerVO } from "#modules/answers/models/ArrayAnswer.model";
import { QuestionAnswerVO } from "#modules/question-answers/models";
import { ChoicesPart, PartType, TextPart } from "#modules/questions/models";

it("should create the entities for this use case without errors", async () => {
  const questionAnswer = plainToInstance(QuestionAnswerVO, {
    question: {
      parts: [
        {
          type: "text" as PartType.Text,
          text: "¿Cuáles de los siguientes son lenguajes de programación?",
        } as TextPart,
        {
          type: "choices" as PartType.Choices,
          pick: "multiple",
          choices: [
            {
              type: "text",
              text: "JavaScript",
            },
            {
              type: "text",
              text: "HTML",
            },
            {
              type: "text",
              text: "Python",
            },
            {
              type: "text",
              text: "CSS",
            },
          ],
        } as ChoicesPart,
      ],
    },
    answer: {
      type: "array",
      arrayType: "set",
      content: [
        {
          type: "text",
          text: "JavaScript",
        } as TextPart,
        {
          type: "text",
          text: "Python",
        } as TextPart,
      ],
    } as ArrayAnswerVO,
  } );
  const errors = await validate(questionAnswer);

  expect(errors.length).toBe(0);
} );
