const CUSTOMER_SESSION_KEY = "customerSession";

export function setCustomerSession(customer) {
  localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(customer));
}

export function getCustomerSession() {
  const raw = localStorage.getItem(CUSTOMER_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearCustomerSession() {
  localStorage.removeItem(CUSTOMER_SESSION_KEY);
}
