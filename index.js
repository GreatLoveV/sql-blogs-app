const express = require("express");
const {
  errorHandler,
  tokenExtractor,
  userExtractor,
} = require("./util/middleware");
const app = express();

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorsRouter = require("./controllers/authors");
const testingRouter = require("./controllers/testing");

const { Blog, User } = require("./models");

app.use(express.json());
app.use(tokenExtractor);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorsRouter);

if (process.env.NODE_ENV === "test" || process.env.TESTING === "true") {
  app.use("/api/testing", testingRouter);
}

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  const isTesting =
    process.env.NODE_ENV === "test" || process.env.TESTING === "true";
  const syncOptions = isTesting ? { force: true } : { alter: true };
  await User.sync(syncOptions);
  await Blog.sync(syncOptions);
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
