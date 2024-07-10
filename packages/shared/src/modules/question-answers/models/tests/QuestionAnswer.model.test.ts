import { validate } from "class-validator";
import { generateValidQuestionAnswerVO } from "./fixtures";
import { generateInvalidAnswerVO } from "#modules/answers/models/tests/fixtures";
import { generateInvalidImagePart } from "#modules/question-answer-common/models/parts/tests/ImagePart.fixtures";
import { generateInvalidQuestionVO, generateInvalidTextQuestionVO, generateValidTextQuestionVO } from "#modules/questions/models/tests/fixtures";

describe("questionAnswerVO", () => {
  it("should pass validation if all properties are correct", async () => {
    const vo = generateValidQuestionAnswerVO();
    const errors = await validate(vo);

    expect(errors).toEqual([]);
  } );

  it("should fail validation if question is invalid", async () => {
    const vo = generateValidQuestionAnswerVO();

    vo.question = generateInvalidQuestionVO();

    const errors = await validate(vo);

    expect(errors.length).toBe(1);
  } );

  it("should fail validation if text part question is invalid in a text question", async () => {
    const vo = generateValidQuestionAnswerVO();

    vo.question = generateInvalidTextQuestionVO();

    const errors = await validate(vo);

    expect(errors.length).toBe(1);
  } );

  it("should fail validation if image part question is invalid in text with image question", async () => {
    const vo = generateValidQuestionAnswerVO();

    vo.question = generateValidTextQuestionVO();

    const imagePart = generateInvalidImagePart();

    vo.question.parts.push(imagePart);

    const errors = await validate(vo);

    expect(errors.length).toBe(1);
  } );

  it("should fail validation if answer is invalid", async () => {
    const vo = generateValidQuestionAnswerVO();

    vo.answer = generateInvalidAnswerVO();

    const errors = await validate(vo);

    expect(errors.length).toBe(1);
  } );
} );
