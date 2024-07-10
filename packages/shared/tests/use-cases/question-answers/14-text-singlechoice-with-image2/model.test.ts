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
          text: "¿A qué país pertenece esta bandera?",
        } as TextPart,
       {
         type: "image",
         url: "https://example.com/flag.jpg",
         name: "flag",
       } as ImagePart,
        {
          type: "choices",
          choices: [
            {
              type: "text",
              text: "Italia",
            },
            {
              type: "text",
              text: "Francia",
            },
            {
              type: "text",
              text: "Alemania",
            },
            {
              type: "text",
              text: "España",
            },
          ],
        } as ChoicesPart,
      ],
    },
    answer: {
      type: "text",
      text: "Italia",
    } as TextAnswerVO,
  } );
  const errors = await validate(questionAnswer);

  expect(errors).toEqual([]);
} );
