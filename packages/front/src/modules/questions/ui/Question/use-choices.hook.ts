import { useState } from "react";
import { Choice } from "../../models";

type ChoicesInQuestionEntity = Choice[];

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
