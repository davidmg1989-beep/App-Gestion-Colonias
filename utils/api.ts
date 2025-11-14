// Lightweight API helper that injects admin token for mutating requests.
export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const method = (init.method || 'GET').toUpperCase();
  let headers: Record<string, string> = {};
  if (init.headers) {
    // normalize existing headers
    const h = init.headers as Record<string, string>;
    headers = { ...h };
  }

  // attach admin token from localStorage if present for mutating requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    try {
      const token = localStorage.getItem('adminToken');
      if (token) headers['x-admin-token'] = token;
    } catch (e) {
      // ignore
    }
  }

  const merged: RequestInit = { ...init, headers };
  const res = await fetch(input, merged);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`Request failed ${res.status} ${res.statusText} ${text}`);
    // @ts-ignore
    err.status = res.status;
    throw err;
  }
  return res.json().catch(() => null);
}
