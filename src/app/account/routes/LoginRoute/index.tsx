import { ActionFunction, redirect } from "react-router-dom";

import { appPasswordRegex } from "@/src/app/account/lib/appPassword";
import { LoginRoute } from "@/src/app/account/routes/LoginRoute/LoginRoute";
import { loginWithPersist } from "@/src/app/account/states/atp";
import { resetLoginFormData } from "@/src/app/account/states/loginFormAtom";

export const action = (async ({ request }) => {
  try {
    const data = await request.formData();
    const service = data.get("service");
    const identifier = data.get("identifier");
    const password = data.get("password");
    // TODO: better validation?
    if (
      typeof service !== "string" ||
      typeof identifier !== "string" ||
      typeof password !== "string" ||
      !password.match(appPasswordRegex)
    ) {
      throw new Error(`Validation error: ${{ identifier, password }}`);
    }

    await loginWithPersist({ service, identifier, password });
    // TODO: redirect has response?
  } catch (e) {
    resetLoginFormData();
  }

  return redirect("/");
}) satisfies ActionFunction;

export const element = <LoginRoute />;
