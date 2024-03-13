const fastify = require('fastify')();
const PORT = process.env.PORT || 3000;
const HOST = process.env.APP_HOST || 'localhost'

fastify.post('/webhooks/ping2', (req, res) => {
  let p = req.body
  return { message: 'pong post', data: p };
});

fastify.post('/webhooks/zoho/sync_gcp', (req, res) => {
  // Extract data from request body 
  const p = req.body;
  return { message: 'Data received successfully', data: p };
});

fastify.post('/webhooks/zoho/sync_contact', (req, res) => {
  // Extract data from request body 
  const p = req.body;
  return { message: 'Data received contact successfully', data: p };
});

fastify.listen({ port: PORT, host: HOST }).then((address) => {
  console.log(`Server is running on ${address}`);
}).catch((err) => {
  console.log('Error starting server:', err);
});







