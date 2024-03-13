const fastify = require('fastify')();
const PORT = process.env.PORT || 3000;
const HOST = process.env.APP_HOST || 'localhost'
fastify.post('/webhooks/zoho/sync_gcp', (req, res) => {
  // Extract data from request body 
  const p = req.body;
  return { message: 'Data received successfully', data: p };
});

fastify.post('/webhooks/zoho/update_contact', (req, res) => {
  // Extract data from request body
  const p = req.body;

  // Perform any necessary processing
  // For demonstration, simply log the received data
  console.log('Received data:', p);

  // Send response
  res.status(200).send({ message: 'Data received successfully', data: p });
});

// Start the server
// fastify.listen(3000, (err, address) => {
//   if (err) throw err;
//   console.log(`Server is running on ${address}`);
// });
fastify.listen({ port: PORT, host: HOST }).then((address) => {
  console.log(`Server is running on ${address}`);
}).catch((err) => {
  console.log('Error starting server:', err);
});
// const express = require('express');
// const bodyParser = require('body-parser');

// const app = express();

// // Middleware to parse JSON bodies
// app.use(bodyParser.json());

// // POST request handler
// app.post('/webhooks/zoho/update_contact', (req, res) => {
//   // Extract data from request body
//   const p = req.body;

//   // Perform any necessary processing
//   // For demonstration, simply log the received data
//   console.log('Received data:', p);

//   // Send response
//   res.status(200).json({ message: 'Data received successfully', data: p });
// });

// // Start the server
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
// require('dotenv').config();

// const Fastify = require("fastify");
// const path = require("path");

// const fastifyCors = require("@fastify/cors");
// const AutoLoad = require("@fastify/autoload");
// const routes = require('./lib/routes');

// const fastify = Fastify({
//   logger: process.env.APP_LOGLEVEL,
// });

// const HOST = process.env.APP_HOST || 'localhost';

// // Run the server!
// const start = async () => {
//   try {
//     var TOPIC = false;
//     var RB = false;
//     fastify
//       .register(fastifyCors, {
//         origin: "*",
//       }).addHook('onRequest', (request, reply, done) => {
//         console.log('Raw Request Data:', request.raw);
//         done();
//       }).register(routes)

//     await fastify.listen({ port: process.env.APP_PORT });
//     console.log(`server listening on ${fastify.server.address().port}`);
//   } catch (err) {
//     fastify.log.error(err);
//     process.exit(1);
//   }
// };
// start();







