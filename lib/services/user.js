const wretch = require("wretch");
const FormUrlAddon = require("wretch/addons/formUrl");
const { services } = require("../../config/config.js");
const CONSTANTS = require("../../constants/index.js");

let user = {};

user.insertUser = async (p) => {
  let resp = {
    error: false,
  };
  try {
    let response = await wretch(`${services.SVC_USERS_URL}/internal/zohouser`)
      .addon(FormUrlAddon)
      .post(p)
      .json();
    console.log(resp);
    resp = response;
  } catch (e) {
    console.log(e);
    resp.error = true;
    resp.message = CONSTANTS.DEFAULT.UNABLE_TO_CREATE_USER;
  }
  return resp;
};

user.insertUserMultipleGcp = async (p) => {
  let resp = {
    error: false,
  };
  try {
    let response = await wretch(`${services.SVC_USERS_URL}/internal/zohouser/multiplegcp`)
      .addon(FormUrlAddon)
      .post(p)
      .json();
    console.log(resp);
    resp = response;
  } catch (e) {
    console.log(e);
    resp.error = true;
    resp.message = CONSTANTS.DEFAULT.UNABLE_TO_CREATE_USER;
  }
  return resp;
};

user.processGcpUserUpdate = async (p) => {
  let resp = {
    error: false,
  };
  try {
    let response = await wretch(`${services.SVC_USERS_URL}/internal/zohouser/update`)
      .addon(FormUrlAddon)
      .post(p)
      .json();
    console.log(resp);
    resp = response;
  } catch (e) {
    console.log(e);
    resp.error = true;
    resp.message = CONSTANTS.DEFAULT.UNABLE_TO_CREATE_USER;
  }
  return resp;
};

module.exports = user;
