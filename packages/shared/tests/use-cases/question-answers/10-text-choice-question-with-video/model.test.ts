import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { TextAnswerVO } from "#modules/answers/models";
import { QuestionAnswerVO } from "#modules/question-answers/models";
import { ChoicesPart, TextPart, VideoPart } from "#modules/questions/models";

it("should create the entities for this use case without errors", () => {
  const questionAnswer = plainToInstance(QuestionAnswerVO, {
    question: {
      parts: [
        {
          type: "text",
          text: "¿Quién está hablando?",
        } as TextPart,
        {
          type: "video",
          url: "https://www.example.com/clip-video.mp4",
          name: "clip",
        } as VideoPart,
        {
          type: "choices",
          choices: [
            {
              type: "text",
              text: "Martin Luther King Jr.",
            },
            {
              type: "text",
              text: "Nelson Mandela",
            },
            {
              type: "text",
              text: "John F. Kennedy",
            },
            {
              type: "text",
              text: "Winston Churchill",
            },
          ],
        } as ChoicesPart,
      ],
    },
    answer: {
      type: "text",
      text: "Martin Luther King Jr.",
    } as TextAnswerVO,
  } );
  const errors = validateSync(questionAnswer);

  expect(errors).toEqual([]);
} );
