require("dotenv").config();

module.exports = {
  DATABASE_URL:
    process.env.TESTING === "true"
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL,
  PORT: process.env.PORT,
  SECRET: process.env.SECRET,
};
