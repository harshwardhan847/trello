import express from "express";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// routes
app.use("api/v1/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server is running on  https://localhost:3000");
});
