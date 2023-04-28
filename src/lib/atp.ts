import { RichText } from "@atproto/api";

export function isRichTextValid(rt: RichText) {
  return rt.length <= 3000 && rt.graphemeLength <= 300;
}

export function isPostValid(
  rt: RichText,
  imageLen: number,
  hasExternal: boolean
) {
  return (
    isRichTextValid(rt) &&
    (rt.graphemeLength > 0 || imageLen > 0 || hasExternal)
  );
}

export type AtpError = {
  error: "NotFound";
  message: string;
};

export function isAtpError(err: unknown): err is AtpError {
  if (typeof err !== "object" || err === null) return false;
  return "error" in err && "message" in err;
}
