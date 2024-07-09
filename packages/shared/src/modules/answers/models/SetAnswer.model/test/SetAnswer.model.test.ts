import { validate } from "class-validator";
import { AnswerType } from "../../AnswerType.enum";
import { generateInvalidItemSetAnswerVO } from "./ItemSetAnswer.fixtures";
import { generateInvalidSetAnswerVO, generateValidSetAnswerVO } from "./SetAnswer.fixtures";

describe("setAnswerVO", () => {
  it("should pass validation if VO is valid", async () => {
    const setAnswer = generateValidSetAnswerVO();
    const errors = await validate(setAnswer);

    expect(errors.length).toBe(0);
  } );

  it("should fail validation if VO is invalid", async () => {
    const setAnswer = generateInvalidSetAnswerVO();
    const errors = await validate(setAnswer);

    expect(errors.length).toBe(1);
  } );

  it("should fail validation if type property is incorrect", async () => {
    const setAnswer = generateValidSetAnswerVO();

    setAnswer.type = "se" as AnswerType.Set;

    const errors = await validate(setAnswer);

    expect(errors.length).toBeGreaterThan(0);
  } );

  it("should fail validation if set property is empty", async () => {
    const setAnswer = generateValidSetAnswerVO();

    setAnswer.set = [];

    const errors = await validate(setAnswer);

    expect(errors.length).toBe(1);
  } );

  it("should fail validation if set property contains invalid values", async () => {
    const setAnswer = generateValidSetAnswerVO();

    setAnswer.set = [generateInvalidItemSetAnswerVO()];

    const errors = await validate(setAnswer);

    expect(errors.length).toBeGreaterThan(0);
  } );
} );
