import UndoIcon from "@mui/icons-material/Undo";
import { IconButton, IconButtonProps } from "../IconButton";
import styles from "./Button.module.css";
type Props = IconButtonProps;
const Button = ( { onClick }: Props) => {
  return (
    <IconButton className={styles.main}onClick={onClick}><UndoIcon /></IconButton>
  );
};

export default Button;
