const express = require("express");
const app = express();
const port = 3000;
const connectDB = require("./db/connect");
require("dotenv").config();
const tasks = require("./routes/tasks");
const notFound = require("./routes/notFound");
app.use(express.static("public"));
app.use(express.static("node_modules/bootstrap/dist"));

app.use(express.json());

app.use("/api/v1/tasks", tasks);
app.use(notFound);
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
