import "reflect-metadata";

import { validate } from "class-validator";
import { AudioPart } from "../AudioPart.model";
import { ImagePart } from "../ImagePart.model";
import { PartType } from "../Part.model";
import { VideoPart } from "../VideoPart.model";
import { generateValidChoicesPart } from "./ChoicesPart.fixtures";
import { generateInvalidTextPart } from "./TextPart.fixtures";

describe("choicesPart", () => {
  it("should pass validation if VO is valid", async () => {
    const choicesPart = generateValidChoicesPart();
    const errors = await validate(choicesPart);

    expect(errors.length).toBe(0);
  } );

  it("should fail validation if type is not PartType.Choices", async () => {
    const invalidChoicesPart = generateValidChoicesPart();

    invalidChoicesPart.type = "invalid-type" as PartType.Choices;

    const errors = await validate(invalidChoicesPart);

    expect(errors.length).toBeGreaterThan(0);
  } );

  describe.each([
    [undefined, true],
    ["multiple", true],
    [{
      min: 1,
      max: 3,
    }, true],
    [{
      min: 3,
      max: 1,
    }, false],
    [{
      min: -1,
      max: 1,
    }, true],
    [{
      min: -1,
    }, true],
    ["any string", false],
    [1, true],
    [999, true],
    [0, false],
    [-1, false],
  ])("pick validation", (pick: any, expectedValid: boolean) => {
    it("should validate a correct ChoicesPart instance", async () => {
      const validChoicesPart = generateValidChoicesPart();

      validChoicesPart.pick = pick;

      const errors = await validate(validChoicesPart);

      if (expectedValid)
        // eslint-disable-next-line jest/no-conditional-expect
        expect(errors.length).toBe(0);
      else
        // eslint-disable-next-line jest/no-conditional-expect
        expect(errors.length).toBeGreaterThan(0);
    } );
  } );

  describe("choices validation", () => {
    it("should fail validation if choice validation don't passes", async () => {
      const choicesPart = generateValidChoicesPart();

      choicesPart.choices = [
        new AudioPart(),
        new ImagePart(),
        generateInvalidTextPart(),
        new VideoPart(),
      ];

      const errors = await validate(choicesPart);

      expect(errors.length).toBe(1);
      expect(errors[0].children?.length).toBe(4);
    } );

    it("should fail validation if choices contain an invalid choice", async () => {
      const invalidChoicesPart = generateValidChoicesPart();

      invalidChoicesPart.choices = [
        generateInvalidTextPart(),
      ];

      const errors = await validate(invalidChoicesPart);

      expect(errors.length).toBeGreaterThan(0);
    } );
  } );
} );
