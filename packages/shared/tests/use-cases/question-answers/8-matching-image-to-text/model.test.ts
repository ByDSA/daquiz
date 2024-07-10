import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { ArrayAnswerVO } from "#modules/answers/models/ArrayAnswer.model";
import { ArrayPart } from "#modules/question-answer-common/models/parts/ArrayPart.model";
import { SetsPart } from "#modules/question-answer-common/models/parts/SetsPart.model";
import { QuestionAnswerVO } from "#modules/question-answers/models";
import { ImagePart, TextPart } from "#modules/questions/models";

it("should create the entities for this use case without errors", () => {
  const questionAnswer = plainToInstance(QuestionAnswerVO, {
    question: {
      parts: [
        {
          type: "text",
          text: "Empareja las imágenes de los animales con sus nombres",
        } as TextPart,
        {
          type: "sets",
          objective: "matching",
          sets: [
            {
              content: [
                {
                  type: "image",
                  url: "https://www.example.com/dog.jpg",
                  name: "dog",
                } as ImagePart,
                {
                  type: "image",
                  url: "https://www.example.com/cat.jpg",
                  name: "cat",
                } as ImagePart,
                {
                  type: "image",
                  url: "https://www.example.com/rabbit.jpg",
                  name: "rabbit",
                } as ImagePart,
              ],
            },
            {
              content: [
                {
                  type: "text",
                  text: "Perro",
                },
                {
                  type: "text",
                  text: "Gato",
                },
                {
                  type: "text",
                  text: "Conejo",
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
              text: "dog",
            },
            {
              type: "text",
              text: "Perro",
            },
          ],
        } as ArrayPart,
        {
          type: "array",
          content: [
            {
              type: "text",
              text: "cat",
            },
            {
              type: "text",
              text: "Gato",
            },
          ],
        } as ArrayPart,
        {
          type: "array",
          content: [
            {
              type: "text",
              text: "rabbit",
            },
            {
              type: "text",
              text: "Conejo",
            },
          ],
        } as ArrayPart,
      ],
    } as ArrayAnswerVO,
  } );
  const errors = validateSync(questionAnswer);

  expect(errors).toEqual([]);
} );
