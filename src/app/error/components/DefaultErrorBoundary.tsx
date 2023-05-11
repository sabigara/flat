import { useRouteError } from "react-router-dom";

import { NotFoundErrorComponent } from "@/src/app/error/components/NotFoundErrorComponent";

export function DefaultErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  // everything is treated as not found, for now.
  return <NotFoundErrorComponent />;
}
