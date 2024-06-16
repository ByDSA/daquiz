/* eslint-disable no-use-before-define */
import compare from "just-compare";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./Choices.module.css";
import { QuestionEntity } from "#modules/questions";
import { AddButton } from "#ui/AddButton";
import { DeleteButton } from "#ui/DeleteButton";
import { TextEditableSaveable } from "#ui/TextEditable";
import { UndoButton } from "#ui/UndoButton";
import { ConfirmButton } from "#utils/components/buttons/ConfirmButton";

type Props = {
  initChoices: QuestionEntity["choices"];
  onSave: (value: QuestionEntity["choices"])=> void;
};
const Choices = ( { initChoices, onSave }: Props) => {
  const { choices, resetChoices, addNewChoice, isChanged, removeChoice } = useChoices( {
    initValue: initChoices,
  } );
  const handleAddChoice = () => {
    addNewChoice( {
      text: "New choice",
    } );
  };
  // eslint-disable-next-line require-await
  const handleSave = async () => {
    onSave(choices?.map(choiceRepresentationToModel));
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
  initValue: QuestionEntity["choices"];
};
type UseChoicesRet = {
  choices: ChoiceRepresentation[] | undefined;
  resetChoices: ()=> void;
  addNewChoice: (newChoice: NonNullable<QuestionEntity["choices"]>[0])=> void;
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

type ChoiceRepresentation = NonNullable<QuestionEntity["choices"]>[0] & { id: string };

function choiceToRepresentation(choice: NonNullable<QuestionEntity["choices"]>[0]): ChoiceRepresentation {
  return {
    id: uuidv4(),
    text: choice.text,
  };
}

function choiceRepresentationToModel(choice: ChoiceRepresentation): NonNullable<QuestionEntity["choices"]>[0] {
  return {
    text: choice.text,
  };
}
