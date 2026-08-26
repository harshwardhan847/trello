import express from "express";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import orgRoutes from "./routes/org.routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authenticate } from "./middleware/auth.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/orgs", authenticate, orgRoutes);
app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Healthy",
  });
});

app.use(errorMiddleware);

app.listen(8000, () => {
  console.log("Server is running on  http://localhost:8000");
});
