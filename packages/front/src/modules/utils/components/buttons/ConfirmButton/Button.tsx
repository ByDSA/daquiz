import CheckIcon from "@mui/icons-material/Check";
import { IconButton, IconButtonProps } from "../IconButton";
import styles from "./Button.module.css";
type Props = IconButtonProps;
const Button = ( { onClick }: Props) => {
  return (
    <IconButton className={styles.main}onClick={onClick}><CheckIcon /></IconButton>
  );
};

export default Button;
