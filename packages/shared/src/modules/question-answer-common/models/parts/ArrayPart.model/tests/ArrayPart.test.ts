import "reflect-metadata";

import { validate } from "class-validator";
import { AudioPart } from "../../AudioPart.model";
import { ImagePart } from "../../ImagePart.model";
import { PartType } from "../../Part.model";
import { generateInvalidTextPart } from "../../tests/TextPart.fixtures";
import { VideoPart } from "../../VideoPart.model";
import { generateValidChoicesPart } from "./ArrayPart.fixtures";

describe("arrayPart", () => {
  it("should pass validation if VO is valid", async () => {
    const part = generateValidChoicesPart();
    const errors = await validate(part);

    expect(errors).toEqual([]);
  } );

  it("should fail validation if type is not PartType.Array", async () => {
    const invalidChoicesPart = generateValidChoicesPart();

    invalidChoicesPart.type = "invalid-type" as PartType.Array;

    const errors = await validate(invalidChoicesPart);

    expect(errors.length).toBeGreaterThan(0);
  } );

  describe("content validation", () => {
    it("should fail validation if content validation don't passes", async () => {
      const part = generateValidChoicesPart();

      part.content = [
        new AudioPart(),
        new ImagePart(),
        generateInvalidTextPart(),
        new VideoPart(),
      ];

      const errors = await validate(part);

      expect(errors.length).toBe(1);
      expect(errors[0].children?.length).toBe(4);
    } );

    it("should fail validation if content contains an invalid content", async () => {
      const invalidChoicesPart = generateValidChoicesPart();

      invalidChoicesPart.content = [
        generateInvalidTextPart(),
      ];

      const errors = await validate(invalidChoicesPart);

      expect(errors.length).toBeGreaterThan(0);
    } );
  } );
} );
