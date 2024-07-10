import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ArrayAnswerVO } from "#modules/answers/models/ArrayAnswer.model";
import { QuestionAnswerVO } from "#modules/question-answers/models";
import { ChoicesPart, ImagePart, TextPart } from "#modules/questions/models";

it("should create the entities for this use case without errors", async () => {
  const questionAnswer = plainToInstance(QuestionAnswerVO, {
    question: {
      parts: [
        {
          type: "text",
          text: "Selecciona todas las frutas que sean cítricos",
        } as TextPart,
        {
          type: "choices",
          pick: "multiple",
          choices: [
            {
              type: "image",
              url: "https://example.com/images/orange.jpg",
              caption: "Naranja",
              name: "orange",
            } as ImagePart,
            {
              type: "image",
              url: "https://example.com/images/apple.jpg",
              caption: "Manzana",
              name: "apple",
            } as ImagePart,
            {
              type: "image",
              url: "https://example.com/images/lemon.jpg",
              caption: "Limón",
              name: "lemon",
            } as ImagePart,
            {
              type: "image",
              url: "https://example.com/images/grape.jpg",
              caption: "Uva",
              name: "grape",
            } as ImagePart,
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
          text: "orange",
        } as TextPart,
        {
          type: "text",
          text: "lemon",
        } as TextPart,
      ],
    } as ArrayAnswerVO,
  } );
  const errors = await validate(questionAnswer);

  expect(errors).toEqual([]);
} );
