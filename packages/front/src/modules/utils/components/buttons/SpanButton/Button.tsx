import styles from "./Button.module.css";
import { Themeable, classNames } from "#utils/styling";

export type PublicProps = Themeable & {
  onClick: ()=> void;
};
type Props = PublicProps & {
  children?: React.ReactNode;
};
const Button = ( { className, onClick, children }: Props) => {
  return (
    <span className={classNames(styles.main, className)}onClick={onClick}>{children}</span>
  );
};

export default Button;
