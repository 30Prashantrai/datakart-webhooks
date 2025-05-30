const wretch = require("wretch");
const FormUrlAddon = require("wretch/addons/formUrl");
const QuerryStringAddon = require("wretch/addons/queryString");
const { services } = require("../../config/config.js");
const CONSTANTS = require("../../constants/index.js");

let key = {};

key.getGcp = async (p) => {
  console.log(p);
  let resp = {
    error: false,
  };
  try {
    let response = await wretch(`${services.SVC_GSONEKEY_URL}/gcp/detail`)
      .addon(QuerryStringAddon)
      .query(p)
      .get()
      .json();
    console.log(response);
    resp = response;
  } catch (e) {
    console.log(e.toString());
    resp.error = true;
    resp.message = CONSTANTS.DEFAULT.UNABLE_TO_FETCH_GCP;
  }
  return resp;
};

key.insertGcp = async (p) => {
  console.log(p);
  let resp = {
    error: false,
  };
  try {
    console.log(p);
    let response = await wretch(`${services.SVC_GSONEKEY_URL}/gcp/zoho/create`)
      .addon(FormUrlAddon)
      .post(p)
      .json();
    console.log(response);
    resp = response;
  } catch (e) {
    console.log(e.toString());
    resp.error = true;
    resp.message = CONSTANTS.DEFAULT.UNABLE_TO_CREATE_GCP;
  }
  return resp;
};

key.setGtins = async (p) => {
  let resp = {
    error: false,
  };
  console.log(p);
  try {
    let response = await wretch(`${services.SVC_GSONEKEY_URL}/gcp/setup`)
      .addon(FormUrlAddon)
      .post(p)
      .json();
    console.log(response);
    resp = response;
  } catch (e) {
    console.log(e.toString());
    resp.error = true;
    resp.message = CONSTANTS.DEFAULT.UNABLE_TO_FETCH_GTIN;
  }
  return resp;
};

module.exports = key;
