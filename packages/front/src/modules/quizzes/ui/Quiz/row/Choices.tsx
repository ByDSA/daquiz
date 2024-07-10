/* eslint-disable no-use-before-define */
import compare from "just-compare";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./Choices.module.css";
import { Choice, PartType, TextPart } from "#modules/questions";
import { AddButton } from "#ui/AddButton";
import { DeleteButton } from "#ui/DeleteButton";
import { TextEditableSaveable } from "#ui/TextEditable";
import { UndoButton } from "#ui/UndoButton";
import { ConfirmButton } from "#utils/components/buttons/ConfirmButton";

type Props = {
  initChoices: Choice[] ;
  onSave: (value: Choice[])=> void;
};
const Choices = ( { initChoices, onSave }: Props) => {
  const { choices, resetChoices, addNewChoice, isChanged, removeChoice } = useChoices( {
    initValue: initChoices,
  } );
  const handleAddChoice = () => {
    addNewChoice( {
      type: PartType.Text,
      text: "New choice",
    } );
  };
  // eslint-disable-next-line require-await
  const handleSave = async () => {
    onSave(choices?.map(choiceRepresentationToModel) ?? []);
  };

  return (
    <section className={styles.main}>
      <p>Choices:</p>
      {
        choices?.map((choice) => {
          return <article className={styles.choice} key={choice.id}>
            <TextEditableSaveable key={choice.text} initialValue={choice.text} />
            <DeleteButton onClick={() => removeChoice(choice.id)} />
          </article>;
        } )
      }
      <article className={styles.buttons}>
        <AddButton onClick={handleAddChoice}/>
        {isChanged
        && <>
          <UndoButton onClick={() => resetChoices()} />
          <ConfirmButton onClick={handleSave} />
        </>}
      </article>
    </section>
  );
};

export default Choices;

type UseChoicesProps = {
  initValue: Choice[];
};
type UseChoicesRet = {
  choices: ChoiceRepresentation[] | undefined;
  resetChoices: ()=> void;
  addNewChoice: (newChoice: Choice)=> void;
  removeChoice: (id: ChoiceRepresentation["id"])=> void;
  isChanged: boolean;
};
function useChoices( { initValue }: UseChoicesProps): UseChoicesRet {
  const initValueRepresentation = useMemo(
    () => initValue?.map(choiceToRepresentation),
    [initValue],
  );
  const [choices, setChoices] = useState(initValueRepresentation);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const changedFromInitialValue = !compare(choices?.map(choiceRepresentationToModel), initValue);

    if (changedFromInitialValue !== isChanged)
      setIsChanged(changedFromInitialValue);
  }, [choices]);

  return {
    choices,
    resetChoices: () => setChoices(initValueRepresentation),
    removeChoice: (id: ChoiceRepresentation["id"]) => {
      setChoices((prevChoices) => prevChoices?.filter((choice) => choice.id !== id));
    },
    addNewChoice: (newChoice) => {
      const newChoiceRepresentation = choiceToRepresentation(newChoice);

      setChoices((prevChoices) => [...(prevChoices ?? []), newChoiceRepresentation]);
    },
    isChanged,
  };
}

type ChoiceRepresentation = Omit<TextPart, "type"> & { id: string };

function choiceToRepresentation(choice: Choice): ChoiceRepresentation {
  if (choice.type === PartType.Text) {
    return {
      id: uuidv4(),
      text: (choice as TextPart).text,
    };
  }

  throw new Error("Choice type not supported");
}

function choiceRepresentationToModel(choice: ChoiceRepresentation): Choice {
  return {
    type: PartType.Text,
    text: choice.text,
  };
}
