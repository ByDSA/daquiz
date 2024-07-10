import { validate } from "class-validator";
import { generateInvalidItemArrayAnswerVO, generateValidItemArrayAnswerVO } from "./ItemArrayAnswer.fixtures";
import { PartType } from "#modules/questions/models";

describe("itemArrayAnswerVO", () => {
  it("should pass validation if VO is valid", async () => {
    const item = generateValidItemArrayAnswerVO();
    const errors = await validate(item);

    expect(errors).toEqual([]);
  } );

  it("should fail validation if VO is invalid", async () => {
    const item = generateInvalidItemArrayAnswerVO();
    const errors = await validate(item);

    expect(errors.length).toBe(1);
  } );

  it("should fail validation if type property is incorrect", async () => {
    const item = generateValidItemArrayAnswerVO();

    item.type = "te" as PartType.Text;

    const errors = await validate(item);

    expect(errors.length).toBe(1);
  } );
} );
