export const storageKeys = {
  session: {
    $: "sessions",
  },
  settings: {
    $: "settings",
  },
};

// not clean but ok for now
export function migrateLocalStorage() {
  localStorage.removeItem("session");
}
