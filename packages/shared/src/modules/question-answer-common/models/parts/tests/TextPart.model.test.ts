import { validate } from "class-validator";
import { generateInvalidTextPart, generateValidTextPart } from "./TextPart.fixtures";
import { IS_SPECIFIC_STRING } from "#utils/validation/decorators/IsSpecificString";

describe("textPart", () => {
  it("should pass validation if VO is valid", async () => {
    const textPart = generateValidTextPart();
    const errors = await validate(textPart);

    expect(errors.length).toBe(0);
  } );

  it("should fail validation if VO is invalid", async () => {
    const textPart = generateInvalidTextPart();
    const errors = await validate(textPart);

    expect(errors.length).toBe(1);
  } );

  it("should validate the type property", async () => {
    const textPart = generateValidTextPart();

    textPart.type = "InvalidType" as any;

    const errors = await validate(textPart);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty(IS_SPECIFIC_STRING);
  } );

  it("should validate the text property", async () => {
    const textPart = generateValidTextPart();

    textPart.text = 123 as any;

    const errors = await validate(textPart);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty("isString");
  } );
} );
