import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { TextAnswerVO } from "#modules/answers/models";
import { QuestionAnswerVO } from "#modules/question-answers/models";
import { ChoicesPart, ImagePart, TextPart } from "#modules/questions/models";

it("should create the entities for this use case without errors", async () => {
  const questionAnswer = plainToInstance(QuestionAnswerVO, {
    question: {
      parts: [
        {
          type: "text",
          text: "¿Este animal es un mamífero?",
        } as TextPart,
       {
         type: "image",
         url: "https://example.com/dog.jpg",
         name: "dog",
       } as ImagePart,
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
  const errors = await validate(questionAnswer);

  expect(errors).toEqual([]);
} );
