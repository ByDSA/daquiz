import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { TextPart } from "../parts";
import { generateInvalidImagePart } from "../parts/tests/ImagePart.fixtures";
import { QuestionVO } from "../Question.model";
import { generateValidQuestionTextWithImageVO, generateValidQuestionVO } from "./fixtures";

it("should pass on valid QuestionVO", async () => {
  const questionVO = generateValidQuestionVO();
  const errors = await validate(questionVO);

  expect(errors.length).toBe(0);
} );

it("should have one or more parts", async () => {
  const questionVO = generateValidQuestionVO();

  questionVO.parts = [];

  const errors = await validate(questionVO);

  expect(errors.length).toBeGreaterThan(0);
} );

it("should validate a part", async () => {
  const questionVO = generateValidQuestionVO();

  (questionVO.parts?.[0] as TextPart).text = 123 as any;
  const errors = await validate(questionVO);

  expect(errors.length).toBeGreaterThan(0);
} );

describe("validate multiple parts", () => {
  describe("using concrete classes", () => {
    it("should fail if one is invalid", async () => {
      let questionVO = generateValidQuestionTextWithImageVO();

      questionVO.parts[1] = generateInvalidImagePart();
      const errors = await validate(questionVO);

      expect(errors.length).toBeGreaterThan(0);
    } );

    it("should pass if all are valid", async () => {
      const questionVO = generateValidQuestionTextWithImageVO();
      const errors = await validate(questionVO);

      expect(errors.length).toBe(0);
    } );
  } );
  describe("using abstract classes", () => {
    it("should fail if one is invalid", async () => {
      let questionVO = generateValidQuestionTextWithImageVO();

      questionVO.parts[1] = generateInvalidImagePart();

      questionVO = plainToInstance(QuestionVO, questionVO);

      const errors = await validate(questionVO);

      expect(errors.length).toBeGreaterThan(0);
    } );

    it("should pass if all are valid", async () => {
      let questionVO = generateValidQuestionTextWithImageVO();

      questionVO = plainToInstance(QuestionVO, questionVO);
      const errors = await validate(questionVO);

      expect(errors.length).toBe(0);
    } );
  } );
} );
