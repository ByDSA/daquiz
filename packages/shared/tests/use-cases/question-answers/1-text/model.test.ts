import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { TextAnswerVO } from "#modules/answers/models";
import { QuestionAnswerVO } from "#modules/question-answers/models";
import { QuestionVO, TextPart } from "#modules/questions/models";

it("should create the entities for this use case without errors", async () => {
  const questionAnswer = plainToInstance(QuestionAnswerVO, {
    question: plainToInstance(QuestionVO, {
      parts: [
        plainToInstance(TextPart, {
          type: "text",
          text: "¿Cuál es la capital de Francia?",
        } ),
      ],
    } ),
    answer: plainToInstance(TextAnswerVO, {
      type: "text",
      text: "París",
    } ),
  } );
  const errors = await validate(questionAnswer);

  expect(errors).toEqual([]);
} );
