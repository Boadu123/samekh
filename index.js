import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import eventRouter from "./routes/eventRoutes.js";
import volunteerRouter from "./routes/volunteerRoutes.js";

await mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connection successful"))
  .catch((error) => console.log("Error connecting to Database", error));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(userRouter);
app.use(eventRouter);
app.use(volunteerRouter);

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
