import { Spinner, SpinnerProps } from "@camome/core/Spinner";
import clsx from "clsx";
import styles from "./SpinnerFill.module.scss";

type Props = SpinnerProps;

export default function SpinnerFill({ className, ...props }: Props) {
  return (
    <div className={clsx(styles.container, className)}>
      <Spinner {...props} />
    </div>
  );
}
