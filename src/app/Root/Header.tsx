import React from "react";
import styles from "./Header.module.scss";

import LogoIcon from "@/src/assets/logo-icon.svg";
import { Link } from "react-router-dom";

type Props = unknown;

export default function Header(props: Props) {
  return (
    <header className={styles.container}>
      <Link to="/" className={styles.logo}>
        <LogoIcon />
        <span className={styles.logo__text}>Flat</span>
      </Link>
    </header>
  );
}
