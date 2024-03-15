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
    console.log(p);
    try {
      if (
        p.activation_date !== null &&
        p.activation_date !== undefined &&
        p.activation_date !== ""
      ) {
        p.activation_date = dayjs(p.activation_date).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      } else {
        delete p.activation_date;
      }
      if (
        p.expiry_date !== null &&
        p.expiry_date !== undefined &&
        p.expiry_date !== ""
      ) {
        p.expiry_date = dayjs(p.expiry_date).format("YYYY-MM-DD HH:mm:ss");
      } else {
        delete p.expiry_date;
      }
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
