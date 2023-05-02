import { getDefaultStore } from "jotai";
import { atomWithImmer } from "jotai-immer";

import { BSKY_SOCIAL } from "@/src/app/account/lib/constants";

export type LoginFormData = {
  service: string;
  identifier: string;
  password: string;
};

const loginFormDataInitial: LoginFormData = {
  service: BSKY_SOCIAL,
  identifier: "",
  password: "",
};

export const loginFormDataAtom =
  atomWithImmer<LoginFormData>(loginFormDataInitial);

export function resetLoginFormData() {
  getDefaultStore().set(loginFormDataAtom, loginFormDataInitial);
}
