import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { ArrayAnswerVO } from "#modules/answers/models";
import { QuestionAnswerVO } from "#modules/question-answers/models";
import { TextPart } from "#modules/questions/models";

it("should create the entities for this use case without errors", () => {
  const questionAnswer = plainToInstance(QuestionAnswerVO, {
    question: {
      parts: [
        {
          type: "text",
          text: "La capital de Italia es ____(1). Y la de España es ______(2).",
        } as TextPart,
      ],
    },
    answer: {
      type: "array",
      arrayType: "list",
      content: [
        {
          type: "text",
          text: "Roma",
        },
        {
          type: "text",
          text: "Madrid",
        },
      ],
    } as ArrayAnswerVO,
  } );
  const errors = validateSync(questionAnswer);

  expect(errors).toEqual([]);
} );
