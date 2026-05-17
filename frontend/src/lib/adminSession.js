const ADMIN_SESSION_KEY = "adminSession";

export function setAdminSession(adminUser) {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
}

export function getAdminSession() {
  const raw = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}
