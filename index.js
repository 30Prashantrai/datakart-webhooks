require('dotenv').config();

const Fastify = require("fastify");
const path = require("path");

const fastifyCors = require("@fastify/cors");
const AutoLoad = require("@fastify/autoload");

const packageJson = require('./package.json');

const fastify = Fastify({
  logger: process.env.APP_LOGLEVEL,
});


// Run the server!
const start = async () => {
  try {
    var TOPIC = false;
    var RB = false;
    fastify
      .register(fastifyCors, {
        origin: "*",
      })
    // .register(AutoLoad, {
    //   dir: path.join(__dirname, "plugins"),
    // }).after((err) => {
    //   if (err) throw err;
    //   console.log(`plugins loaded`)
    // });


    fastify.get('/webhooks/ping', (req, reply) => {
      reply.send({ "msg": "webhooks service is up and running", "version": packageJson.version })
    });

    // sample event => 
    fastify.put('/webhooks/zoho/sync_gcp', async (req, reply) => {

      let p = req.body;
      console.log(`received sync gcp event > `, p)
      reply.code(200).send();
    });

    // sample event => fnme, lname,company, email, state
    fastify.put('/webhooks/zoho/update_contact', async (req, reply) => {
      let p = req.body;
      console.log(`received contact event > `, p)
      reply.code(200).send();
    });


    await fastify.listen({ port: process.env.APP_PORT, host: process.env.APP_HOST });
    console.log(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();







