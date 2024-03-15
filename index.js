const routes = require("./lib/routes");

const fastify = require("fastify")({
  logger: process.env.APP_LOGLEVEL || "debug",
});
const PORT = process.env.APP_PORT || 3000;
const HOST = process.env.APP_HOST || "localhost";

fastify
  .register(require("@fastify/cors"), {
    origin: "*",
  })
  .register(routes);

fastify
  .listen({ port: PORT, host: HOST })
  .then((address) => {
    console.log(`Server is running on ${address}`);
  })
  .catch((err) => {
    console.log("Error starting server:", err);
  });
