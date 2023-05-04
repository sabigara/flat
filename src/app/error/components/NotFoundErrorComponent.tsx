import { Button } from "@camome/core/Button";
import { useTranslation } from "react-i18next";
import { TbArrowLeft } from "react-icons/tb";
import { Link } from "react-router-dom";

import styles from "./NotFoundErrorComponent.module.scss";

export function NotFoundErrorComponent() {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <p className={styles.number}>404</p>
      <h1 className={styles.notFound}>{t("errors.not-found")}</h1>
      <Button
        component={Link}
        to="/"
        size="sm"
        startDecorator={<TbArrowLeft />}
        className={styles.button}
      >
        {t("errors.go-home")}
      </Button>
    </div>
  );
}
