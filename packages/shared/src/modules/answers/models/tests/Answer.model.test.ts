import { validate } from "class-validator";
import { AnswerType } from "../AnswerType.enum";
import { generateInvalidAnswerVO, generateValidAnswerVO } from "./fixtures";

describe("answerVO", () => {
  it("should pass validation if VO is valid", async () => {
    const answer = generateValidAnswerVO();
    const errors = await validate(answer);

    expect(errors).toEqual([]);
  } );

  it("should fail validation if VO is invalid", async () => {
    const answer = generateInvalidAnswerVO();
    const errors = await validate(answer);

    expect(errors.length).toBe(1);
  } );

  it("should fail validation if type property is incorrect", async () => {
    const answer = generateValidAnswerVO();

    answer.type = "se" as AnswerType.Array;

    const errors = await validate(answer);

    expect(errors.length).toBeGreaterThan(0);
  } );
} );
