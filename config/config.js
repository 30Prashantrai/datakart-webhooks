require("dotenv").config();

// Extract configuration values from environment variables or use defaults
const APP_PORT = process.env.APP_PORT || 3000;
const APP_HOST = process.env.APP_HOST || "localhost";
const APP_VERSION = "0.0.1";
const LOGLEVEL = process.env.LOGLEVEL ? process.env.LOGLEVEL : "error";
const SQL_HOST =
  process.env.DB_HOST ||
  "gsonetimescaledbserver-dev.postgres.database.azure.com";
const SQL_USER = process.env.DB_USER || "timescaledbadmin";
const SQL_PASS = process.env.DB_PASS || "p78jsuRt#eOlu";
const SQL_SCHEMA = process.env.DB_NAME || "gsonedevdb";
const SQL_PORT = process.env.DB_PORT ? process.env.DB_PORT : 5432;
const DB_SSL = process.env.DB_SSL ? process.env.DB_SSL : false;
const DB_DEBUG = process.env.DB_DEBUG || false;

const config = {
  app: {
    app_version: APP_VERSION,
    app_port: APP_HOST,
    app_port: APP_PORT,
    logger: { level: LOGLEVEL },
  },
  databases: {
    pg: {
      client: "pg",
      debug: DB_DEBUG,
      connection: {
        host: SQL_HOST,
        port: SQL_PORT,
        user: SQL_USER,
        password: SQL_PASS,
        database: SQL_SCHEMA,
        ssl: DB_SSL,
        // schema: "datakart"
      },
      searchPath: ["datakart_zohocrm"],
    },
  },
  services: {
    SVC_TENANT_URL: process.env.SVC_TENANT_URL,
    SVC_GSONEKEY_URL: process.env.SVC_GSONEKEY_URL,
    SVC_USERS_URL: process.env.SVC_USERS_URL,
    SVC_SUPERFIELDS_URL: process.env.SVC_SUPERFIELDS_URL,
  },
};

module.exports = config;
