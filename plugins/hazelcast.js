'use strict'
/* eslint no-prototype-builtins: 0 */
const fp = require('fastify-plugin')
const {Client} = require('hazelcast-client');

const hzconfig =   {
  clusterName: process.env.HZ_CLUSTER_NAME,
  network: {
    clusterMembers: [
      process.env.HZ_MEMBERS
    ]
  }
}

module.exports.privacy = {
  NOCACHE: 'no-cache',
  PUBLIC: 'public',
  PRIVATE: 'private'
}

module.exports = fp(async function (fastify, opts) {
  console.log(`registering hz `,hzconfig)
  try {
    const handler = await Client.newHazelcastClient(hzconfig)

    fastify
      .decorate('hz', handler)
      .addHook('onClose', (instance, done) => {

        /* istanbul ignore else */
        if (instance.fhz === handler) {
          instance.fhz.destroy();
          delete instance.fhz;
        }

        done();
      });


  } catch (err) {
    console.error(err);
  }
})
