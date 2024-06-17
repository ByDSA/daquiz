import { useState } from "react";
import { QuestionEntity } from "../../models";

type ChoicesInQuestionEntity = NonNullable<QuestionEntity["choices"]>;

type Props = {
  onSelected?: (choice: ChoicesInQuestionEntity[number], index: number)=> void;
  onLoaded?: ()=> void;
};
export type UseChoicesRet = {
  selectedIndex: number | null;
  onClickEach: (choice: ChoicesInQuestionEntity[number], index: number)=> void;
  reset: ()=> void;
};

export function useChoices( { onSelected }: Props): UseChoicesRet {
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);

  return {
    selectedIndex: selectedChoiceIndex,
    onClickEach: (choice: ChoicesInQuestionEntity[number], index: number) => {
      setSelectedChoiceIndex(index);
      onSelected?.(choice, index);
    },
    reset: () => setSelectedChoiceIndex(null),
  };
}
