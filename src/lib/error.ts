import { toast } from "react-hot-toast";

export function stringifyError(err: unknown) {
  if (typeof err === "object")
    return JSON.stringify(err, Object.getOwnPropertyNames(err), 2);
  return String(err);
}

export function handleError({
  error,
  message,
}: {
  error: unknown;
  message: string;
}) {
  console.error(stringifyError(error));
  toast.error(message);
}
