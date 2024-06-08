import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, IconButtonProps } from "../IconButton";
import styles from "./Button.module.css";

type Props = IconButtonProps;
const Button = ( { onClick }: Props) => {
  return (
    <IconButton className={styles.main}onClick={onClick}><DeleteIcon /></IconButton>
  );
};

export default Button;
