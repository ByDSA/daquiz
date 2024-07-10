import { validate } from "class-validator";
import { generateInvalidTextItemArrayAnswerVO, generateValidItemArrayAnswerVO, generateValidTextItemArrayAnswerVO } from "./ItemArrayAnswer.fixtures";
import { PartType } from "#modules/questions/models";

describe("textItemArrayAnswerVO", () => {
  it("should pass validation if VO is valid", async () => {
    const item = generateValidTextItemArrayAnswerVO();
    const errors = await validate(item);

    expect(errors).toEqual([]);
  } );

  it("should fail validation if VO is invalid", async () => {
    const item = generateInvalidTextItemArrayAnswerVO();
    const errors = await validate(item);

    expect(errors.length).toBe(1);
  } );

  it("should fail validation if type property is incorrect", async () => {
    const item = generateValidItemArrayAnswerVO();

    item.type = "te" as PartType.Text;

    const errors = await validate(item);

    expect(errors.length).toBe(1);
  } );

  it("should fail validation if text property is invalid", async () => {
    const item = generateValidTextItemArrayAnswerVO();

    item.text = 123 as any;

    const errors = await validate(item);

    expect(errors.length).toBeGreaterThan(0);
  } );
} );
