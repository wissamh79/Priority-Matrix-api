require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");

//mongoDB
const connectDB = require("./db/connectDB");
const authenticateUser = require("./middleware/authentication");
const cookieParser = require("cookie-parser");

//routers
const authRouter = require("./routes/auth");

const unurgentImportantRouter = require("./routes/tasks/unurgentImportant");
const unurgentUnimportantRouter = require("./routes/tasks/unurgentUnimportant");
const urgentImportantRouter = require("./routes/tasks/urgentImportant");
const urgentUnimportantRouter = require("./routes/tasks/urgentUnimportant");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/errorHandler");

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));
// built-in middleware for json
app.use(express.json());
//middleware for cookies
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Productivity Matrix API");
});
app.use("/api/v1/auth", authRouter);
app.use(
  "/api/v1/tasks/unurgentImportant",
  authenticateUser,
  unurgentImportantRouter
);
app.use(
  "/api/v1/tasks/unurgentUnimportant",
  authenticateUser,
  unurgentUnimportantRouter
);
app.use(
  "/api/v1/tasks/urgentImportant",
  authenticateUser,
  urgentImportantRouter
);
app.use(
  "/api/v1/tasks/urgentUnimportant",
  authenticateUser,
  urgentUnimportantRouter
);

// app.use("/api/v1/tasks", authenticateUser, taskRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3500;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
