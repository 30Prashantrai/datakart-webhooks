const wretch = require("wretch");
const FormUrlAddon = require("wretch/addons/formUrl");
const { services } = require("../../config/config.js");
const CONSTANTS = require("../../constants/index.js");

let wowSns = {};

wowSns.sendSNS = async (p) => {
  let resp = {
    error: false,
  };
  try {
    let response = await wretch(
      `${services.SVC_WOWSNS_URL}/wowsns/sendsns/${p.tenant_id}/${p.notification_code}`
    )
      .addon(FormUrlAddon)
      .post(p.sendParams)
      .json();
    console.log(response);
    resp = response;
  } catch (e) {
    console.log(e.toString());
    resp.error = true;
    resp.message = CONSTANTS.DEFAULT.UNABLE_TO_SEND_SNS;
  }
  return resp;
};
module.exports = wowSns;
