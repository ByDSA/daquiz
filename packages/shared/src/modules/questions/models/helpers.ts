import { PartType, TextPart } from "./parts";
import { QuestionVO } from "./Question.model";

export function findFirstTextPart(question: QuestionVO): TextPart | undefined {
  for (let part of question.parts) {
    if (part.type === PartType.Text) {
      return part as TextPart;
    }
  }

  return undefined;
}

export function hasChoices(question: QuestionVO): boolean {
  return question.parts.some(part => part.type === PartType.Choices);
}