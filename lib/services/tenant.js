const wretch = require("wretch");
const FormUrlAddon = require("wretch/addons/formUrl");
const QuerryStringAddon = require("wretch/addons/queryString");
const { services } = require("../../config/config.js");
const CONSTANTS = require("../../constants/index.js");

let tenant = {};

tenant.SyncGcp = async (p) => {
  let resp = {
    error: false,
  };
  try {
    let response = await wretch(
      `${services.SVC_TENANT_URL}/internal/company/syncgcp`
    )
      .addon(FormUrlAddon)
      .post(p)
      .json();
    console.log(resp);
    resp = response;
  } catch (e) {
    console.log(e);
    resp.error = true;
    resp.message = CONSTANTS.DEFAULT.UNABLE_TO_UPDATE_COMPANY;
  }
  return resp;
};

tenant.updateCompany = async (p) => {
  let resp = {
    error: false,
  };
  try {
    let response = await wretch(`${services.SVC_TENANT_URL}/internal/company`)
      .addon(FormUrlAddon)
      .put(p)
      .json();
    resp = response;
    console.log(resp);
  } catch (e) {
    console.log(e);
    resp.error = true;
    resp.message = CONSTANTS.DEFAULT.UNABLE_TO_UPDATE_COMPANY;
  }
  return resp;
};

tenant.insertCompany = async (p) => {
  let resp = {
    error: false,
  };
  try {
    let response = await wretch(
      `${services.SVC_TENANT_URL}/internal/zohocompany`
    )
      .addon(FormUrlAddon)
      .post(p)
      .json();
    resp = response;
    console.log(resp);
  } catch (e) {
    console.log(e);
    resp.error = true;
    resp.message = CONSTANTS.DEFAULT.UNABLE_TO_UPDATE_COMPANY;
  }
  return resp;
};

tenant.insertContact = async (p) => {
  let resp = {
    error: false,
  };
  try {
    let response = await wretch(`${services.SVC_TENANT_URL}/internal/contact`)
      .addon(FormUrlAddon)
      .post(p)
      .json();
    resp = response;
    console.log(resp);
  } catch (e) {
    console.log(e);
    resp.error = true;
    resp.message = CONSTANTS.DEFAULT.UNABLE_TO_UPDATE_COMPANY;
  }
  return resp;
};

tenant.updateContact = async (p) => {
  let resp = {
    error: false,
  };
  try {
    let response = await wretch(
      `${services.SVC_TENANT_URL}/internal/contacts/synccontacts`
    )
      .addon(FormUrlAddon)
      .post(p)
      .json();
    resp = response;
  } catch (e) {
    console.log(e);
    resp.error = true;
    resp.message = CONSTANTS.DEFAULT.UNABLE_TO_UPDATE_COMPANY;
  }
  return resp;
};

tenant.getCompanyDetails = async (p) => {
  let resp = {
    error: false,
  };
  try {
    let response = await wretch(`${services.SVC_TENANT_URL}/internal/company`)
      .addon(QuerryStringAddon)
      .query(p)
      .get()
      .json();
    resp = response;
  } catch (e) {
    console.log(e);
    resp.error = true;
    resp.message = CONSTANTS.DEFAULT.UNABLE_TO_UPDATE_COMPANY;
  }
  return resp;
};

tenant.syncGcpToVbg = async (p) => {
  let resp = {
    error: false,
  };
  try {
    let response = await wretch(
      `${services.SVC_TENANT_URL}/internal/company/synctovbg`
    )
      .addon(FormUrlAddon)
      .post(p)
      .json();
    resp = response;
  } catch (e) {
    console.log(e);
    resp.error = true;
    resp.message = CONSTANTS.DEFAULT.UNABLE_TO_UPDATE_COMPANY;
  }
  return resp;
};

module.exports = tenant;
