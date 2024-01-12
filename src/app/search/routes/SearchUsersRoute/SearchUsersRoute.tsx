import { IconButton } from "@camome/core/IconButton";
import { Input } from "@camome/core/Input";
import { InputGroup } from "@camome/core/InputGroup";
import React from "react";
import { useTranslation } from "react-i18next";
import { TbSearch } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";

import { getBskyApi } from "@/src/app/account/states/atp";
import { queryKeys } from "@/src/app/root/lib/queryKeys";
import Seo from "@/src/app/seo/Seo";
import { UserList, UserListQueryFn } from "@/src/app/user/components/UserList";

import styles from "./SearchUsersRoute.module.scss";

export function SearchUsersRoute() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const [term, setTerm] = React.useState(search.get("q") ?? "");
  const queryKey = queryKeys.search.$({ term });
  const queryFn: UserListQueryFn<typeof queryKey> = async ({ pageParam }) => {
    const resp = await getBskyApi().actor.searchActors({
      term,
      limit: 25,
      cursor: pageParam?.cursor,
    });
    if (!resp.success) throw new Error("Fetch error");
    return {
      users: resp.data.actors,
      cursor: resp.data.cursor,
    };
  };
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    if (!inputRef.current) return;
    const newVal = inputRef.current.value;
    setTerm(newVal);
    navigate(
      location.pathname + "?" + new URLSearchParams({ q: newVal }).toString(),
      {
        replace: true,
      },
    );
  };

  const title = t("search.title");
  return (
    <>
      <Seo title={title} />
      <h1 className={styles.title}>{title}</h1>
      <div role="search" className={styles.search}>
        <form onSubmit={handleSubmit}>
          <InputGroup
            input={
              <Input
                label={t("search.field.label")}
                type="search"
                placeholder={t("search.field.placeholder")}
                defaultValue={term}
                enterKeyHint="search"
                fill
                autoFocus
                required
                ref={inputRef}
              />
            }
            endDecorator={
              <IconButton
                aria-label={title}
                size="sm"
                variant="soft"
                colorScheme="neutral"
              >
                <TbSearch />
              </IconButton>
            }
          />
        </form>
      </div>
      <p className={styles.description}>{t("search.description")}</p>
      <UserList
        queryKey={queryKey}
        queryFn={queryFn}
        enabled={!!term}
        className={styles.list}
      />
    </>
  );
}
