import { Markup } from "@camome/core/Markup";

import Seo from "@/src/app/seo/Seo";

import styles from "./InviteCodeRoute.module.scss";

const codes = [
  "bsky-social-7sgwn6b",
  "bsky-social-csugabg",
  "bsky-social-qzwide6",
];

export function InviteCodesRoute() {
  return (
    <>
      <Seo title="Invite codes" />
      <div>
        <Markup>
          <ul className={styles.ul}>
            {codes.map((code) => (
              <li key={code}>{code}</li>
            ))}
          </ul>
        </Markup>
      </div>
    </>
  );
}
