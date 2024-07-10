import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { TextAnswerVO } from "#modules/answers/models";
import { QuestionAnswerVO } from "#modules/question-answers/models";
import { AudioPart, ChoicesPart, TextPart } from "#modules/questions/models";

it("should create the entities for this use case without errors", () => {
  const questionAnswer = plainToInstance(QuestionAnswerVO, {
    question: {
      parts: [
        {
          type: "text",
          text: "¿De qué banda es esta canción?",
        } as TextPart,
        {
          type: "audio",
          url: "https://www.example.com/song.mp3",
          name: "clip",
        } as AudioPart,
        {
          type: "choices",
          choices: [
            {
              type: "text",
              text: "The Beatles",
            },
            {
              type: "text",
              text: "The Rolling Stones",
            },
            {
              type: "text",
              text: "Queen",
            },
            {
              type: "text",
              text: "Pink Floyd",
            },
          ],
        } as ChoicesPart,
      ],
    },
    answer: {
      type: "text",
      text: "The Beatles",
    } as TextAnswerVO,
  } );
  const errors = validateSync(questionAnswer);

  expect(errors).toEqual([]);
} );
