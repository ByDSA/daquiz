import { Choice, ChoicesPart, PartType, TextPart } from "./parts";
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

export function findChoices(question: QuestionVO): Choice[] {
  const choicePart = question.parts.find(part => part.type === PartType.Choices) as ChoicesPart | undefined;

  if (!choicePart) {
    return [];
  }

  return choicePart.choices;
}