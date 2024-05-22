const routes = require("./lib/routes");
const config = require("./config/config");

const fastify = require("fastify")(config.app);

fastify
  .register(require("@fastify/cors"), {
    origin: "*",
  })
  .register(routes);

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: config.app.app_port, host: "0.0.0.0" });
    console.log(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
