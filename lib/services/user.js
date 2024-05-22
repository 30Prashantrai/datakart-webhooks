const wretch = require("wretch");
const FormUrlAddon = require("wretch/addons/formUrl");
const { services } = require("../../config/config.js");

let user = {};

user.insertUser = async (p) => {
  let resp = {
    error: false,
  };
  try {
    let response = await wretch(`${services.SVC_USERS_URL}/internal/user`)
      .addon(FormUrlAddon)
      .post(p)
      .json();
    console.log(resp);
    resp = response;
  } catch (e) {
    console.log(e);
    resp.error = true;
    resp.message = "Failed to create user";
  }
  return resp;
};

module.exports = user;
