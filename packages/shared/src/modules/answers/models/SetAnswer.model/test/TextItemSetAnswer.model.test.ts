import { validate } from "class-validator";
import { ItemSetAnswerType } from "../ItemSetAnswer.model";
import { generateInvalidTextItemSetAnswerVO, generateValidItemSetAnswerVO, generateValidTextItemSetAnswerVO } from "./ItemSetAnswer.fixtures";

describe("textItemSetAnswerVO", () => {
  it("should pass validation if VO is valid", async () => {
    const item = generateValidTextItemSetAnswerVO();
    const errors = await validate(item);

    expect(errors.length).toBe(0);
  } );

  it("should fail validation if VO is invalid", async () => {
    const item = generateInvalidTextItemSetAnswerVO();
    const errors = await validate(item);

    expect(errors.length).toBe(1);
  } );

  it("should fail validation if type property is incorrect", async () => {
    const item = generateValidItemSetAnswerVO();

    item.type = "te" as ItemSetAnswerType.Text;

    const errors = await validate(item);

    expect(errors.length).toBe(1);
  } );

  it("should fail validation if text property is invalid", async () => {
    const item = generateValidTextItemSetAnswerVO();

    item.text = 123 as any;

    const errors = await validate(item);

    expect(errors.length).toBeGreaterThan(0);
  } );
} );
