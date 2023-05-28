export const storageKeys = {
  session: {
    $: "sessions",
  },
  settings: {
    $: "settings",
  },
  currentFeed: {
    $: "currentFeed",
  },
};

// not clean but ok for now
export function migrateLocalStorage() {
  localStorage.removeItem("session");
}
