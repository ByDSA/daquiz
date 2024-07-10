import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { TextAnswerVO } from "#modules/answers/models";
import { QuestionAnswerVO } from "#modules/question-answers/models";
import { ImagePart, TextPart } from "#modules/questions/models";

it("should create the entities for this use case without errors", async () => {
  const questionAnswer = plainToInstance(QuestionAnswerVO, {
    question: {
      parts: [
        {
          type: "text",
          text: "¿Quién es el autor de esta obra?",
        } as TextPart,
       {
         type: "image",
         url: "https://example.com/obra-picaso.jpg",
         name: "obra-picaso",
       } as ImagePart,
      ],
    },
    answer: {
      type: "text",
      text: "Picasso",
    } as TextAnswerVO,
  } );
  const errors = await validate(questionAnswer);

  expect(errors).toEqual([]);
} );
