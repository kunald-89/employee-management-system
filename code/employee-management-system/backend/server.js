import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pool, bootstrapAdmin } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

for (const key of ["DATABASE_URL", "JWT_SECRET", "BOOTSTRAP_ADMIN_EMAIL", "BOOTSTRAP_ADMIN_PASSWORD"]) {
  if (!process.env[key]) throw new Error("Missing required environment variable: " + key);
}
if (process.env.JWT_SECRET.length < 32) throw new Error("JWT_SECRET must be at least 32 characters.");

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "10kb" }));

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.get("/api/health", wrap(async (_req, res) => {
  await pool.query("SELECT 1");
  res.json({ status: "ok", database: "connected" });
}));
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/chat", chatRoutes);
app.use((_req, res) => res.status(404).json({ error: "Route not found." }));
app.use((err, _req, res, _next) => {
  console.error("Request failed:", err?.code || err?.name || "unknown");
  res.status(500).json({ error: "Internal server error." });
});

const port = Number(process.env.PORT || 5000);
await bootstrapAdmin();
app.listen(port, "0.0.0.0", () => console.log("EMS API listening on port " + port));
