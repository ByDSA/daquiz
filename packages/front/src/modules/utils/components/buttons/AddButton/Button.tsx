import AddIcon from "@mui/icons-material/Add";
import { IconButton, IconButtonProps } from "../IconButton";
import styles from "./Button.module.css";

type Props = IconButtonProps;
const Button = ( { onClick }: Props) => {
  return (
    <IconButton className={styles.main}onClick={onClick}><AddIcon /></IconButton>
  );
};

export default Button;
