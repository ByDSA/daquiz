import { validate } from "class-validator";
import { generateInvalidTextPart, generateValidTextPart } from "../parts/tests/TextPart.fixtures";
import { generateInvalidTextQuestionVO, generateValidQuestionVO, generateValidTextQuestionVO } from "./fixtures";

it("should pass on valid VO", async () => {
  const questionVO = generateValidTextQuestionVO();
  const errors = await validate(questionVO);

  expect(errors.length).toBe(0);
} );

it("should fail on invalid VO", async () => {
  const questionVO = generateInvalidTextQuestionVO();
  const errors = await validate(questionVO);

  expect(errors.length).toBeGreaterThan(0);
} );

it("should have if has no parts", async () => {
  const questionVO = generateValidTextQuestionVO();

  questionVO.parts = [] as any;

  const errors = await validate(questionVO);

  expect(errors.length).toBeGreaterThan(0);
} );
it("should have if has more than one part", async () => {
  const questionVO = generateValidTextQuestionVO();

  questionVO.parts = [
    generateValidTextPart(),
    generateValidTextPart(),
  ] as any;

  const errors = await validate(questionVO);

  expect(errors.length).toBeGreaterThan(0);
} );

it("should validate each the text part", async () => {
  const questionVO = generateValidQuestionVO();

  questionVO.parts = [generateInvalidTextPart() as any];
  const errors = await validate(questionVO);

  expect(errors.length).toBeGreaterThan(0);
} );
