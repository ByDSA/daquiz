import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type Choice = {
  id: string;
  text: string;
};
export type UseChoicesRet = {
  choices: Choice[];
  addChoice: ()=> void;
  removeChoice: (index: number)=> void;
  updateChoice: (index: number, text: string)=> void;
  clearAllChoices: ()=> void;
};

export function useChoices(): UseChoicesRet {
  const [choices, setChoices] = useState<Choice[]>([]);
  const addChoice = () => setChoices([...choices, {
    id: uuidv4(),
    text: "",
  }]);

  return {
    choices,
    addChoice,
    removeChoice: (index: number) => {
      const newChoices = [...choices];

      newChoices.splice(index, 1);
      setChoices(newChoices);
    },
    updateChoice: (index: number, text: string) => {
      const newChoices = [...choices];

      newChoices[index] = {
        ...newChoices[index],
        text,
      };
      setChoices(newChoices);
    },
    clearAllChoices: () => setChoices([]),
  };
}
