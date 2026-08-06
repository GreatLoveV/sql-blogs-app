const { Sequelize } = require("sequelize");
const { DATABASE_URL } = require("./config");

// Determine if we should use SSL based on the DATABASE_URL
const useSSL = DATABASE_URL && !DATABASE_URL.includes("localhost") && !DATABASE_URL.includes("127.0.0.1");

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: useSSL
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {}, // No special SSL options for local connections
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("connected to the database");
  } catch (err) {
    console.log("failed to connect to the database");
    return process.exit(1);
  }

  return null;
};

module.exports = { sequelize, connectToDatabase };