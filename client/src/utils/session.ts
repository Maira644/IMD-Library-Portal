import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
}

export function getToken() {
  return (
    localStorage.getItem("access_token") ??
    sessionStorage.getItem("access_token")
  );
}

export function getTokenExpiry(token: string): number | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const expiry = getTokenExpiry(token);

  if (!expiry) return true;

  return Date.now() >= expiry;
}