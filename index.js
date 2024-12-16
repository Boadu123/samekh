import express from "express";
import mongoose from "mongoose";
import cors from "cors";

await mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connection successful"))
  .catch((error) => console.log("Error connecting to Database", error));

const app = express();
app.use(cors());

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
