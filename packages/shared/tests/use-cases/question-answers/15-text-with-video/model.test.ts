import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { TextAnswerVO } from "#modules/answers/models";
import { QuestionAnswerVO } from "#modules/question-answers/models";
import { TextPart, VideoPart } from "#modules/questions/models";

it("should create the entities for this use case without errors", () => {
  const questionAnswer = plainToInstance(QuestionAnswerVO, {
    question: {
      parts: [
        {
          type: "text",
          text: "¿Cuál es el nombre de este actor?",
        } as TextPart,
        {
          type: "video",
          url: "https://www.example.com/clip.mp4",
          name: "clip",
        } as VideoPart,
      ],
    },
    answer: {
      type: "text",
      text: "Tom Cruise",
    } as TextAnswerVO,
  } );
  const errors = validateSync(questionAnswer);

  expect(errors).toEqual([]);
} );
