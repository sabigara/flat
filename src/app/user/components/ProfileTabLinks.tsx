import clsx from "clsx";
import { NavLink } from "react-router-dom";

import styles from "./ProfileTabLinks.module.scss";

type Props = {
  className?: string;
};

export function ProfileTabLinks({ className }: Props) {
  return (
    <ul className={clsx(styles.list, className)}>
      <Item to="." label="投稿" />
      <Item to="./with-replies" label="返信" />
      <Item to="./likes" label="いいね" />
    </ul>
  );
}

type ItemProps = {
  to: string;
  label: string;
};

function Item({ to, label }: ItemProps) {
  return (
    <li className={styles.item}>
      <NavLink to={to} replace preventScrollReset end>
        {label}
      </NavLink>
    </li>
  );
}
