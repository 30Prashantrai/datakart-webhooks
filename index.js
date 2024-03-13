const fastify = require('fastify')();
const PORT = process.env.PORT || 3000;
const HOST = process.env.APP_HOST || 'localhost'
const packageJson = require('./package.json')
fastify.get('/webhooks/ping', (req, res) => {

  return { message: 'pong', version: packageJson.version };
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







