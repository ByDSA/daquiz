import { validate } from "class-validator";
import { ItemSetAnswerType } from "../ItemSetAnswer.model";
import { generateInvalidItemSetAnswerVO, generateValidItemSetAnswerVO } from "./ItemSetAnswer.fixtures";

describe("itemSetAnswerVO", () => {
  it("should pass validation if VO is valid", async () => {
    const item = generateValidItemSetAnswerVO();
    const errors = await validate(item);

    expect(errors.length).toBe(0);
  } );

  it("should fail validation if VO is invalid", async () => {
    const item = generateInvalidItemSetAnswerVO();
    const errors = await validate(item);

    expect(errors.length).toBe(1);
  } );

  it("should fail validation if type property is incorrect", async () => {
    const item = generateValidItemSetAnswerVO();

    item.type = "te" as ItemSetAnswerType.Text;

    const errors = await validate(item);

    expect(errors.length).toBe(1);
  } );
} );
