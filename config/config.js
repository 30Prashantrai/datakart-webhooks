require("dotenv").config();

// Extract configuration values from environment variables or use defaults
const APP_PORT = process.env.APP_PORT || 3000;
const APP_HOST = process.env.APP_HOST || "localhost";
const APP_VERSION = "0.0.1";
const LOGLEVEL = process.env.LOGLEVEL ? process.env.LOGLEVEL : "error";

const config = {
  app: {
    app_version: APP_VERSION,
    app_port: APP_HOST,
    app_port: APP_PORT,
    logger: { level: LOGLEVEL },
  },
  services: {
    SVC_TENANT_URL: process.env.SVC_TENANT_URL,
    SVC_GSONEKEY_URL: process.env.SVC_GSONEKEY_URL,
    SVC_USERS_URL: process.env.SVC_USERS_URL,
  },
};

module.exports = config;
