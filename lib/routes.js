'use strict';

function configureRoutes(fastify, opts, done) {

  const packageJson = require('../package.json')
  fastify.get('/webhooks/ping2', (req, reply) => {
    reply.send({ "msg": "webhooks service is up and running", "version": packageJson.version })
  });

  fastify.post('/webhooks/ping', async (req, reply) => {
    reply.send({ "msg": "webhooks service is up and running post", "version": packageJson.version })
  });

  // sample event => 
  fastify.put('/webhooks/zoho/sync_gcp', async (req, reply) => {

    let p = req.body;
    console.log(`received sync gcp event > `, p)
    return { error: false, msg: 'to be implemented' };
  });

  // sample event => fnme, lname,company, email, state
  fastify.post('/webhooks/zoho/update_contact', (req, reply) => {
    try {
      const jsonData = JSON.parse(req.body);
      console.log(`received update contact event > `, jsonData)
      // Process jsonData...
      reply.send({ success: true });
    } catch (error) {
      reply.status(400).send({ error: 'Invalid JSON data' });
    }
  });

  done();

}

module.exports = configureRoutes;