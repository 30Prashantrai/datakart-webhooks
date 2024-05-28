const wretch = require("wretch");
const FormUrlAddon = require("wretch/addons/formUrl");
const QuerryStringAddon = require("wretch/addons/queryString");
const { services } = require("../../config/config.js");

let fields = {};

fields.getDefaultTemplate = async (p) => {
  console.log(p);
  let resp = {
    error: false,
  };
  try {
    let response = await wretch(
      `${services.SVC_SUPERFIELDS_URL}/superfields/internal/rendering/${p.template_for}`
    )
      .get()
      .json();
    console.log(response);
    resp.data = response;
  } catch (e) {
    console.log(e.toString());
    resp.error = true;
    resp.message = "Failed to fetch rendering template";
  }
  return resp;
};

fields.insertTemplate = async (p) => {
  console.log(p);
  let resp = {
    error: false,
  };
  try {
    let response = await wretch(
      `${services.SVC_SUPERFIELDS_URL}/superfields/internal/rendering`
    )
      .addon(FormUrlAddon)
      .post(p)
      .json();
    resp.data = response.data;
  } catch (e) {
    console.log(e.toString());
    resp.error = true;
    resp.message = "Failed to fetch rendering template";
  }
  return resp;
};

module.exports = fields;
