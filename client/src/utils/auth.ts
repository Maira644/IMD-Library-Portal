const STORAGE_KEY = "imd_auth_user";

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);

  localStorage.removeItem("access_token");
  sessionStorage.removeItem("access_token");
}

export function getToken() {
  return (
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token")
  );
}