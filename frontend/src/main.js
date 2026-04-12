import "./style.css";
import * as api from "./api.js";

const app = document.querySelector("#app");

function render(state) {
  const { tasks, error, loading } = state;
  app.innerHTML = `
    <h1>Tasks</h1>
    <div class="panel">
      ${error ? `<p class="error">${escapeHtml(error)}</p>` : ""}
      <form class="add" id="add-form">
        <input
          type="text"
          name="title"
          placeholder="New task…"
          autocomplete="off"
          ${loading ? "disabled" : ""}
        />
        <button type="submit" ${loading ? "disabled" : ""}>Add</button>
      </form>
      ${
        tasks.length === 0
          ? '<p class="empty">No tasks yet.</p>'
          : `<ul class="tasks" id="task-list">
              ${tasks
                .slice()
                .sort((a, b) => a.id - b.id)
                .map(
                  (t) => `
                <li data-id="${t.id}">
                  <label>
                    <input type="checkbox" ${t.done ? "checked" : ""} data-action="toggle" />
                    <span class="${t.done ? "done" : ""}">${escapeHtml(t.title)}</span>
                  </label>
                  <button type="button" class="delete" data-action="delete" title="Delete">×</button>
                </li>`,
                )
                .join("")}
            </ul>`
      }
    </div>
  `;

  document.querySelector("#add-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = e.target.elements.title;
    const title = input.value.trim();
    if (!title) return;
    setState({ ...getState(), loading: true, error: null });
    try {
      await api.createTask(title);
      input.value = "";
      await refresh();
    } catch (err) {
      setState({ ...getState(), loading: false, error: err.message || "Failed to add task" });
      render(getState());
    }
  });

  document.querySelector("#task-list")?.addEventListener("change", async (e) => {
    const checkbox = e.target.closest('input[type="checkbox"][data-action="toggle"]');
    if (!checkbox) return;
    const li = checkbox.closest("li");
    const id = Number(li?.dataset.id);
    if (!Number.isFinite(id)) return;
    try {
      await api.updateTask(id, { done: checkbox.checked });
      await refresh();
    } catch (err) {
      setState({ ...getState(), error: err.message || "Failed to update" });
      render(getState());
    }
  });

  document.querySelector("#task-list")?.addEventListener("click", async (e) => {
    const btn = e.target.closest('button[data-action="delete"]');
    if (!btn) return;
    const li = btn.closest("li");
    const id = Number(li?.dataset.id);
    if (!Number.isFinite(id)) return;
    try {
      await api.deleteTask(id);
      await refresh();
    } catch (err) {
      setState({ ...getState(), error: err.message || "Failed to delete" });
      render(getState());
    }
  });
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

let state = { tasks: [], error: null, loading: false };

function getState() {
  return state;
}

function setState(next) {
  state = next;
}

async function refresh() {
  setState({ ...getState(), loading: true, error: null });
  try {
    const tasks = await api.fetchTasks();
    setState({ tasks, error: null, loading: false });
  } catch (err) {
    setState({ tasks: [], error: err.message || "Could not load tasks", loading: false });
  }
  render(getState());
}

refresh();
