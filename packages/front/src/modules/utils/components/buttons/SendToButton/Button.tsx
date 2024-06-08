import MoveUpIcon from "@mui/icons-material/MoveUp";
import { IconButton, IconButtonProps } from "../IconButton";
import styles from "./Button.module.css";

type Props = IconButtonProps;
const Button = ( { onClick }: Props) => {
  return (
    <IconButton className={styles.main}onClick={onClick}><MoveUpIcon /></IconButton>
  );
};

export default Button;
