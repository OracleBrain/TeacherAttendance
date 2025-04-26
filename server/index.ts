import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes";

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: "http://localhost:5000",
  credentials: true
}));
app.use(express.json());

// Register all routes
const server = registerRoutes(app);

// Start the server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
