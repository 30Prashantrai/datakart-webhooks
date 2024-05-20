const wretch = require("wretch");
const FormUrlAddon = require("wretch/addons/formUrl");
const QuerryStringAddon = require("wretch/addons/queryString");
const { services } = require("../../config/config.js");

let key = {};

key.getGcp = async (p) => {
  console.log(p);
  let resp = {
    error: false,
  };
  try {
    console.log(p);
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
    resp.message = "Failed to fetch gcp";
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
    let response = await wretch(`${services.SVC_GSONEKEY_URL}/gcp/create`)
      .addon(FormUrlAddon)
      .post(p)
      .json();
    console.log(response);
    resp = response;
  } catch (e) {
    console.log(e.toString());
    resp.error = true;
    resp.message = "Failed to create gcp";
  }
  return resp;
};

module.exports = key;
