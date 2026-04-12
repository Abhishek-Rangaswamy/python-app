import cors from "cors";
import express from "express";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  }),
);
app.use(express.json());
app.use("/api/tasks", taskRoutes);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
