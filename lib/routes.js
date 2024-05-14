function configureRoutes(fastify, opts, done) {
  const handler = require("./handlers")(fastify);

  fastify.get("/webhooks/ping", (req, res) => {
    return { message: "pong", version: packageJson.version };
  });

  fastify.post("/webhooks/zoho/sync_gcp", (req, res) => {
    // Extract data from request body
    const p = req.body;
    let r = handler.syncGCP(p);
    return r;
  });

  fastify.post("/webhooks/zoho/sync_registration", (req, res) => {
    // Extract data from request body
    const p = req.body;
    let r = handler.syncRegistration(p);
    return r;
  });

  fastify.post("/webhooks/zoho/sync_contact", (req, res) => {
    // Extract data from request body
    const p = req.body;
    let r = handler.syncContact(p);
    return r;
  });

  done();
}

module.exports = configureRoutes;
