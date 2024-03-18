let tenantServices = require("./services/tenant.js");
const dayjs = require("dayjs");

function configureHandler(fastify) {
  let handler = {};

  handler.syncGCP = async (p) => {
    let resp = {
      error: false,
    };
    try {
      let contact = await tenantServices.SyncGcp(p);
      return contact;
    } catch (error) {
      resp.error = true;
      resp.message = error;
      console.error(error);
    }
    return resp;
  };

  handler.syncRegistration = async (p) => {
    let resp = {
      error: false,
    };
    try {
      let contact = await tenantServices.updateCompany(p);
      return contact;
    } catch (error) {
      resp.error = true;
      resp.message = error;
      console.error(error);
    }
    return resp;
  };

  handler.syncContact = async (p) => {
    let resp = {
      error: false,
    };
    try {
      let contact = await tenantServices.updateContact(p);
      return contact;
    } catch (error) {
      resp.error = true;
      resp.message = error;
      console.error(error);
    }
    return resp;
  };

  return handler;
}

module.exports = configureHandler;
