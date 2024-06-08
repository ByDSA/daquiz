import { SpanButtonProps } from "../SpanButton";
import styles from "./Button.module.css";
import { classNames } from "#/modules/utils/styling";

export type PublicProps = SpanButtonProps;
type Props = PublicProps & {
  children?: React.ReactNode;
};
const Button = ( { className, onClick, children }: Props) => {
  return (
    <span className={classNames(styles.main, className)}onClick={onClick}>{children}</span>
  );
};

export default Button;
