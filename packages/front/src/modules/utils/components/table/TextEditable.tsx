import { ChangeEventHandler, FocusEventHandler, useState } from "react";
import { classNames } from "../../styling";
import styles from "./TextEditable.module.css";

type Props = {
  value: string | undefined;
  isEdited: boolean;
  isEditing: boolean;
  onChange?: (value: string)=> void;
  onBlur?: ()=> void;
  onClick?: ()=> void;
  placeholder?: string;
  className?: string;
};
const TextEditable = ( { value, isEditing, isEdited, onChange, onBlur, onClick }: Props) => {
  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    const newValue = event.target.value;

    onChange?.(newValue);
  };
  const handleBlur: FocusEventHandler<HTMLTextAreaElement> = () => {
    onBlur?.();
  };

  return <span className={styles.main} onClick={() => onClick?.()}>
    {
      isEditing
        ? (
          <textarea
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        )
        : (
          <span
            className={classNames(styles.span, isEdited && styles.edited)}
          >{value}
          </span>
        )
    }
  </span>;
};

export default TextEditable;

type UseTextEditableProps = {
  initialValue?: string;
};
type UseTextEditableReturn = {
  isEditing: boolean;
  isEdited: boolean;
  value: string | undefined;
  setValue: (value: string | undefined)=> void;
  setIsEditing: (isEditing: boolean)=> void;
};
export function useTextEditable(
  { initialValue }: UseTextEditableProps,
): UseTextEditableReturn {
  const [currentValue, setCurrentValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  return {
    isEdited: initialValue !== currentValue,
    isEditing,
    value: currentValue,
    setValue: setCurrentValue,
    setIsEditing,
  };
}

type MakeTextEditableProps = {
  initialValue?: string;
  onChange?: (value: string)=> void;
  onSave?: (value: string | undefined)=> Promise<void>;
};
export function TextEditableSaveable(
  { initialValue, onChange, onSave }: MakeTextEditableProps,
): JSX.Element {
  const { isEdited, isEditing, setIsEditing, setValue, value } = useTextEditable( {
    initialValue,
  } );
  const component = (
    <>
      <TextEditable
        value={value}
        isEditing={isEditing}
        isEdited={isEdited}
        onClick={() => {
          if (!isEditing)
            setIsEditing(true);
        }}
        onBlur={() => {
          setIsEditing(false);
        }}
        onChange={(newValue) => {
          setValue(newValue);
          onChange?.(newValue);
        }}
      />
      {isEdited
      && <>
        <button onClick={()=> {
          onSave?.(value);

          return;
        }}>Confirmar</button>
        <button onClick={()=> {
          setValue(initialValue);

          return;
        }}>Reset</button>
      </>}
    </>);

  return component;
}
