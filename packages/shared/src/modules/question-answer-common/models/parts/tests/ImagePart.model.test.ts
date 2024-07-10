import { validate } from "class-validator";
import { generateInvalidImagePart, generateValidImagePart } from "./ImagePart.fixtures";
import { IS_SPECIFIC_STRING } from "#utils/validation/decorators/IsSpecificString";

describe("imagePart", () => {
  it("should pass validation if VO is valid", async () => {
    const vo = generateValidImagePart();
    const errors = await validate(vo);

    expect(errors).toEqual([]);
  } );

  it("should fail validation if VO is invalid", async () => {
    const vo = generateInvalidImagePart();
    const errors = await validate(vo);

    expect(errors.length).toBe(1);
  } );

  it("should validate the type property", async () => {
    const textPart = generateValidImagePart();

    textPart.type = "InvalidType" as any;

    const errors = await validate(textPart);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty(IS_SPECIFIC_STRING);
  } );

  it("should validate the url property", async () => {
    const textPart = generateValidImagePart();

    textPart.url = undefined as any;

    const errors = await validate(textPart);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty("isString");
  } );

  it("should validate text caption property", async () => {
    const textPart = generateValidImagePart();

    textPart.caption = "ASDF";

    const errors = await validate(textPart);

    expect(errors).toEqual([]);
  } );

  it("should validate undefined caption property", async () => {
    const textPart = generateValidImagePart();

    textPart.caption = undefined;

    const errors = await validate(textPart);

    expect(errors).toEqual([]);
  } );
} );
