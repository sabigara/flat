export const isMac =
  window.navigator.platform.toUpperCase().indexOf("MAC") >= 0;
export const isIOS =
  navigator.platform === "iPhone" || navigator.platform === "iPad";

export function isMobile() {
  const userAgent = navigator.userAgent || navigator.vendor;
  return /Android|iPhone|iPad/i.test(userAgent);
}
