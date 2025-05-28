import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// import routes
import userRoutes from "./routes/user.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import executionRoute from "./routes/execute-code.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import testRoutes from "./routes/test.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: `${process.env.BASE_URL}:${PORT}`,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/problems", problemRoutes)
app.use("/api/v1/execute-code", executionRoute)
app.use("/api/v1/submission", submissionRoutes)
app.use("/api/v1/playlist", playlistRoutes)
app.use("/api/v1/tests", testRoutes)

app.listen(PORT, () => {
  console.log(`app is listening on PORT: ${PORT}`);
});