import { validate } from "class-validator";
import { AnswerType } from "../../AnswerType.enum";
import { generateInvalidArrayAnswerVO, generateValidArrayAnswerVO } from "./ArrayAnswer.fixtures";
import { generateInvalidItemArrayAnswerVO } from "./ItemArrayAnswer.fixtures";

describe("setAnswerVO", () => {
  it("should pass validation if VO is valid", async () => {
    const setAnswer = generateValidArrayAnswerVO();
    const errors = await validate(setAnswer);

    expect(errors).toEqual([]);
  } );

  it("should fail validation if VO is invalid", async () => {
    const setAnswer = generateInvalidArrayAnswerVO();
    const errors = await validate(setAnswer);

    expect(errors.length).toBe(1);
  } );

  it("should fail validation if type property is incorrect", async () => {
    const setAnswer = generateValidArrayAnswerVO();

    setAnswer.type = "se" as AnswerType.Array;

    const errors = await validate(setAnswer);

    expect(errors.length).toBeGreaterThan(0);
  } );

  it("should fail validation if set property is empty", async () => {
    const setAnswer = generateValidArrayAnswerVO();

    setAnswer.content = [];

    const errors = await validate(setAnswer);

    expect(errors.length).toBe(1);
  } );

  it("should fail validation if set property contains invalid values", async () => {
    const setAnswer = generateValidArrayAnswerVO();

    setAnswer.content = [generateInvalidItemArrayAnswerVO()];

    const errors = await validate(setAnswer);

    expect(errors.length).toBeGreaterThan(0);
  } );
} );
