import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { MatchingPart } from "#/modules/questions/models/parts/MatchingPart.model";
import { SetAnswerVO, TextArraySetItemVO } from "#modules/answers/models/SetAnswer.model";
import { QuestionAnswerVO } from "#modules/question-answers/models";
import { TextPart } from "#modules/questions/models";

it("should create the entities for this use case without errors", async () => {
  const questionAnswer = plainToInstance(QuestionAnswerVO, {
    question: {
      parts: [
        {
          type: "text",
          text: "Empareja los países con sus capitales",
        } as TextPart,
        {
          type: "matching",
          sets: [
            {
              content: [
                "España",
                "Francia",
                "Alemania",
              ],
            },
            {
              content: [
                "Madrid",
                "París",
                "Berlín",
              ],
            },
          ],
        } as MatchingPart,
      ],
    },
    answer: {
      type: "set",
      set: [
        {
          type: "text-array",
          texts: ["España", "Madrid"],
        } as TextArraySetItemVO,
        {
          type: "text-array",
          texts: ["Francia", "París"],
        } as TextArraySetItemVO,
        {
          type: "text-array",
          texts: ["Alemania", "Berlín"],
        } as TextArraySetItemVO,
      ],
    } as SetAnswerVO,
  } );
  const errors = await validate(questionAnswer);

  expect(errors.length).toBe(0);
} );
