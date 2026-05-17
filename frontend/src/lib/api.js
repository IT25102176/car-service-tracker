const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const responseText = await response.text();

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const errorData = responseText ? JSON.parse(responseText) : null;
      if (errorData?.error) message = errorData.error;
    } catch {}
    throw new Error(message);
  }

  if (!responseText) return null;
  try {
    return JSON.parse(responseText);
  } catch {
    return null;
  }
}

function createCrudApi(resourcePath) {
  return {
    getAll: () => request(resourcePath),
    getById: (id) => request(`${resourcePath}/${id}`),
    create: (payload) =>
      request(resourcePath, { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) =>
      request(`${resourcePath}/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    remove: (id) => request(`${resourcePath}/${id}`, { method: "DELETE" }),
  };
}

export const usersApi = createCrudApi("/api/users");
usersApi.loginByPhone = (phone) =>
  request(`/api/users/customer-login?phone=${encodeURIComponent(phone)}`);
export const vehiclesApi = createCrudApi("/api/vehicles");
export const servicesApi = createCrudApi("/api/services");
export const maintenanceApi = createCrudApi("/api/maintenance");
export const appointmentsApi = createCrudApi("/api/appointments");
export const invoicesApi = createCrudApi("/api/invoices");
