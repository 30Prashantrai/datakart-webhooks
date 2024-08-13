'use strict'
/* eslint no-prototype-builtins: 0 */
const fp = require('fastify-plugin')
const { createClient } = require('@clickhouse/client');


module.exports = fp(async function (fastify, opts) {
  fastify.log.debug(`registering clickhouse `)
  try {
    const handler = createClient(opts)
    // console.log(handler)
    fastify
      .decorate('ch', handler)
      .addHook('onClose', (instance, done) => {

        /* istanbul ignore else */
        if (instance.ch === handler) {
          instance.ch.close();
          fastify.log.info(`clickhouse closed`)
          delete instance.ch;
        }

        done();
      });


  } catch (err) {
    fastify.log.error(err);
  }
})
