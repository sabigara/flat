import { toast } from "react-hot-toast";

import { stringifyError } from "@/src/app/error/lib/stringifyError";

export function notifyError({
  error,
  message,
}: {
  error: unknown;
  message: string;
}) {
  console.error(stringifyError(error));
  toast.error(message);
}
