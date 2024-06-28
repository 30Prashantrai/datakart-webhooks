const routes = require("./lib/routes");
const config = require("./config/config");
const fastifyknexjs = require("fastify-knexjs");

const fastify = require("fastify")(config.app);

const dbtest = async () => {
  try {
    let k = fastify.knex;
    let r = await k.select(k.raw(`now() as today`));
    console.log(`db test returned > `, r[0]);
  } catch (e) {
    throw e;
  }
};

fastify
  .register(require("@fastify/cors"), {
    origin: "*",
  })
  .register(fastifyknexjs, config.databases.pg)
  .after(async (err) => {
    if (err) {
      throw err;
    }
    await dbtest();
    console.log("sql registered using knex");
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
