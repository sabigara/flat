import { Markup } from "@camome/core/Markup";
import { Message } from "@camome/core/Message";

import styles from "./AboutRoute.module.scss";

const ghUrl = "https://github.com/sabigara/flat" as const;
const authorFlatUrl =
  "https://flat-bs.vercel.app/sabigara.bsky.social" as const;
const authorEmail = "mailto:lemonburst1958@gmail.com" as const;

export function AboutRoute() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About</h1>
      <Markup className={styles.markup}>
        <p>
          Flat is an open-source web client app for{" "}
          <a href="https://bsky.app">Bluesky</a>, and maybe other ATP-conforming
          services coming in the future.
        </p>
        <Message status="warn">
          This app is currently highly experimental and unstable. I'm taking
          care of security, but use it at your own risk.
        </Message>
        <h2>Contributing</h2>
        If you find any bugs or want to add features, feel free to contact me in
        any way described below.
        <h3>If you're a developer...</h3>
        <p>
          Submit an issue to the <a href={ghUrl}>GitHub repository</a>.
        </p>
        <h3>If you're a non-developer...</h3>
        <p>
          <a href={authorFlatUrl}>Reply to me (sabigara.bsky.social)</a> or{" "}
          <a href={authorEmail}>email me</a>.
        </p>
        <Message status="info">
          Before submitting an issue, check the{" "}
          <a href="https://github.com/sabigara/flat/issues/5">TODO list</a> to
          know if your problem is already under consideration.
        </Message>
        <h2>Links</h2>
        <ul>
          <li>
            <a href={ghUrl}>GitHub</a>
          </li>
          <li>
            <a href={authorFlatUrl}>Author</a>
          </li>
        </ul>
      </Markup>
    </div>
  );
}
