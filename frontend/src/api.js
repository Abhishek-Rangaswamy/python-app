const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
const apiBaseUrl = rawApiBaseUrl.replace(/\/+$/, "");
const base = `${apiBaseUrl}/api/tasks`;

export async function fetchTasks() {
  const res = await fetch(base);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createTask(title) {
  const res = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateTask(id, patch) {
  const res = await fetch(`${base}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${base}/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) throw new Error(await res.text());
}
