import { ChangeEventHandler, FocusEventHandler, useState } from "react";
import { classNames } from "../../../../styling";
import { ConfirmButton } from "../../../buttons/ConfirmButton";
import { UndoButton } from "../../../buttons/UndoButton";
import styles from "./TextEditable.module.css";

type TextEditableStatelessProps = {
  value: string | undefined;
  isEdited: boolean;
  isEditing: boolean;
  onChange?: (value: string)=> void;
  onBlur?: ()=> void;
  onClick?: ()=> void;
  placeholder?: string;
  className?: string;
};
const TextEditableStateless = ( { value,
  isEditing,
  isEdited,
  onChange,
  onBlur,
  onClick }: TextEditableStatelessProps) => {
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

export default TextEditableStateless;

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

type TextEditableProps = {
  initialValue?: string;
  onChange?: (value: string)=> void;
  onSave?: (value: string | undefined)=> Promise<void>;
};
export function TextEditable(
  { initialValue, onChange, onSave }: TextEditableProps,
): JSX.Element {
  const { isEdited, isEditing, setIsEditing, setValue, value } = useTextEditable( {
    initialValue,
  } );
  const component = (
    <>
      <TextEditableStateless
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
      {isEdited && onSave
      && <>
        <ConfirmButton onClick={()=> {
          onSave?.(value);

          return;
        }} />
        <UndoButton onClick={()=> {
          setValue(initialValue);

          return;
        }} />
      </>}
    </>);

  return component;
}
