const tasks = new Map();
let nextId = 1;

export function listTasks(_req, res) {
  res.json([...tasks.values()]);
}

export function getTask(req, res) {
  const id = Number(req.params.id);
  const task = tasks.get(id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.json(task);
}

export function createTask(req, res) {
  const { title } = req.body ?? {};
  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "title is required" });
  }
  const id = nextId++;
  const task = { id, title: title.trim(), done: false };
  tasks.set(id, task);
  res.status(201).json(task);
}

export function updateTask(req, res) {
  const id = Number(req.params.id);
  const task = tasks.get(id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  const { title, done } = req.body ?? {};
  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "title must be a non-empty string" });
    }
    task.title = title.trim();
  }
  if (done !== undefined) {
    if (typeof done !== "boolean") {
      return res.status(400).json({ error: "done must be a boolean" });
    }
    task.done = done;
  }
  tasks.set(id, task);
  res.json(task);
}

export function deleteTask(req, res) {
  const id = Number(req.params.id);
  if (!tasks.delete(id)) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.status(204).send();
}
