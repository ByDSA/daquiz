import { validateSync } from "class-validator";
import { Part, PartType } from "../../Part.model";
import { TextPart } from "../../TextPart.model";
import { IsArrayPartContent } from "../IsArrayContent";

class NoIgnoreClass {
  @IsArrayPartContent()
  content!: Part[];
}

it("should pass with content=[TextPart]", () => {
  const c = new NoIgnoreClass();

  c.content = [
    {
      type: "text",
      text: "a",
    } as TextPart,
  ];

  const errors = validateSync(c);

  expect(errors).toEqual([]);
} );

class IgnoreTextClass {
  @IsArrayPartContent( {
    ignoreTypes: [PartType.Text],
  } )
  content!: Part[];
}

it("should fail with content=[TextPart]", () => {
  const c = new IgnoreTextClass();

  c.content = [
    {
      type: "text",
      text: "a",
    } as TextPart,
  ];

  const errors = validateSync(c);

  expect(errors.length).toBeGreaterThan(0);
} );
