import { validate } from "class-validator";
import { AnswerType } from "../AnswerType.enum";
import { generateInvalidTextAnswerVO, generateValidTextAnswerVO } from "./fixtures";

describe("textAnswerVO", () => {
  it("should pass validation if VO is valid", async () => {
    const textAnswer = generateValidTextAnswerVO();
    const errors = await validate(textAnswer);

    expect(errors.length).toBe(0);
  } );

  it("should fail validation if VO is invalid", async () => {
    const textAnswer = generateInvalidTextAnswerVO();
    const errors = await validate(textAnswer);

    expect(errors.length).toBe(1);
  } );

  it("should fail validation if type property is incorrect", async () => {
    const textAnswer = generateValidTextAnswerVO();

    textAnswer.type = AnswerType.Array as any;

    const errors = await validate(textAnswer);

    expect(errors.length).toBe(1);
  } );

  it("should fail validation if text property is not a string", async () => {
    const textAnswer = generateValidTextAnswerVO();

    textAnswer.text = 123 as any;

    const errors = await validate(textAnswer);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty("isString");
  } );
} );
