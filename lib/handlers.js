let tenantServices = require("./services/tenant.js");
let gsonekeyServices = require("./services/gsonekeys.js");
let superfiedServices = require("./services/superfields.js");
let userService = require("./services/user.js");
let config = require("../config/config.js");
let chConfig = config.databases.ch;
const dayjs = require("dayjs");
const { customAlphabet } = require("nanoid"),
  nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10),
  customNumber = customAlphabet("1234567890", 9);

function configureHandler(fastify) {
  let handler = {};
  const ch_client = fastify.ch;

  let insertLog = async (logData) => {
    try {
      if (!logData.is_old) {
        logData.id = customAlphabet(8);
        let r = await ch_client.insert({
          table: chConfig.schema + ".zoho_log",
          values: logData,
          format: "JSONEachRow",
        });
        //console.log(r)
        return true;
      }

    } catch (error) {
      console.log("Error while insert log");
      console.log(error);
      return { error: true, message: error };
    }
  }

  let processMultipleGcp = async (p,company_id,gcp) => {
    // process user for multiple gcp
    let user_obj = {
      id: nanoid(10),
      company_id: company_id,
      gcp : gcp,
      user_name: p.contact_details.contact_name,
      user_email: p.contact_details.contact_email,
      user_phone: p.contact_details.contact_phone,
      user_designation: p.contact_details.contact_designation,
      user_status: true,
      is_primary_user: true,
      toc_status: true,
      toc_date: new Date(Date.now())
    };
    userService.insertUserMultipleGcp(user_obj);
  }

  let processGcpUserUpdate = async (p,company_id,gcp) => {
    // process user for multiple gcp
    let user_obj = {
      id: nanoid(10),
      company_id: company_id,
      gcp : gcp,
      user_name: p.contact_details.contact_name,
      user_email: p.contact_details.contact_email,
      user_phone: p.contact_details.contact_phone,
      user_designation: p.contact_details.contact_designation,
      user_status: true,
      is_primary_user: true,
      toc_status: true,
      toc_date: new Date(Date.now())
    };
    userService.processGcpUserUpdate(user_obj);
  }

  

  handler.syncGCP = async (p) => {
    let resp = {
      error: false,
    };
    let isExitingCompany = false;

    let logData = {};
    try {
      // Create or update company
      logData = {
        gcp: p.gcp,
        zoho_id: p.zoho_id,
        data: p,
        is_old: false,
        //type : "",
        created_date: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        error: "",
        status: "initiated"
      }
      // check gcp exists already
      if (p.gcp) {
        let company_obj = {
          gcp: p.gcp,
          company_name: p.company_name,
          company_email: p.contact_details.contact_email,
          company_type: "manufacturer",
          // company_tier: p.company_tier,
          company_city: p.company_city,
          company_state: p.company_state,
          company_country: p.company_country,
          company_phone: p.contact_details.contact_phone,
          company_status: true,
          activation_date: dayjs(p.activation_date).format("YYYY-MM-DD"),
          expiry_date: dayjs(p.expiry_date).format("YYYY-MM-DD"),
          zoho_id: p.zoho_id,
          account_id: p.account_id,
          address1: p.company_address,
        };
        let companyresp = await tenantServices.insertCompany(company_obj);
        if (companyresp.error) {
          console.log(companyresp)
          logData.status = "failed";
          logData.error = "Error in company creation";
          insertLog(logData);
          console.log("Error while insert company details");
          return companyresp;
        }
        if (companyresp.is_existing) {
          isExitingCompany = true;
          console.log(companyresp);

          let gcp = companyresp.data.gcp;
          let exists = gcp.includes(p.gcp);
          if (!exists && !companyresp.is_multiple_gcp) {
            logData.is_old = true;
          }

        }

        if (companyresp.is_multiple_gcp) {
          logData.status = "failed";
          logData.error = "Multiple GCP";
          processMultipleGcp(p,companyresp.data.company_id,p.gcp);
          //return { status: true, message: "Sucess" };
        }
        else if(!companyresp.is_existing)
        {
          let user_obj = {
            id: nanoid(10),
            company_id: companyresp.data.company_id,
            user_name: p.contact_details.contact_name,
            user_email: p.contact_details.contact_email,
            user_phone: p.contact_details.contact_phone,
            user_designation: p.contact_details.contact_designation,
            user_status: true,
            is_primary_user: true,
            toc_status: true,
            toc_date: new Date(Date.now()),
            is_multiple_gcp: companyresp.is_multiple_gcp,
          };
          let userresp = await userService.insertUser(user_obj);
          if (userresp.error) {
            console.log(userresp);
            logData.status = "failed";
            logData.error = "Error in user creation : " + userresp.message;
            insertLog(logData);
            console.log("Error while insert user details");
            return { status: false, message: "Error while insert user details" };
          }


          // Create a new contact
          let contact_obj = {
            id: nanoid(10),
            company_id: companyresp.data.company_id,
            contact_name: p.contact_details.contact_name,
            contact_email: p.contact_details.contact_email,
            contact_phone: p.contact_details.contact_phone,
            contact_designation: p.contact_details.contact_designation,
            contact_type: "primary",
            contact_status: true,
            user_id: userresp.data.id,
            creator_id: userresp.data.id,
          };
          let contactresp = await tenantServices.insertContact(contact_obj);
          if (contactresp.error) {
            console.log(contactresp);
            logData.status = "failed";
            logData.error = "Error in contact creation - " + contactresp.message;
            console.log("Error while insert contact details");
            insertLog(logData);

            return contactresp;
          }
        }
        else
        {
          // if existing company then update the contact details
          processGcpUserUpdate(p,companyresp.data.company_id,p.gcp);
        }


        //create a new User
       

        if (!companyresp.is_existing || companyresp.is_multiple_gcp) {
          let info_type = "";
          if(p.info_type)
          {
            info_type = p.info_type;
          }
          else
          {
            info_type = "EAN";
          }

          //Sync GCP to VBG
          let vbg_obj = {
            company_id: companyresp.data.company_id,
            gcp: p.gcp,
          };
          //tenantServices.syncGcpToVbg(vbg_obj);

          // Create a new GCP
          let gcp_obj = {
            company_id: companyresp.data.company_id,
            account_id: p.account_id,
            gcp: p.gcp,
            activation_at: dayjs(p.activation_date).format("YYYY-MM-DD"),
            expiry_at: dayjs(p.expiry_date).format("YYYY-MM-DD"),
            zoho_registration_id: p.zoho_id,
          };
          let gcpresp = await gsonekeyServices.insertGcp(gcp_obj);
          if (gcpresp.error) {
            console.log(gcpresp);
            logData.status = "failed";
            logData.error = "Error in GCP creation - " + gcpresp.message;
            console.log("Error while insert gcp details");
            insertLog(logData);

            return gcpresp;
          }

          //Gtin  & Gln Allocation
          let company_gcp = {
            company_id: companyresp.data.company_id,
            gcp: p.gcp,
            info_type: info_type,
          };
          console.log("GCP & GTIN Allocation",company_gcp);
          let gtin = await gsonekeyServices.setGtins(company_gcp);
          if (gtin.error) {
            console.log(gtin);
            logData.status = "failed";
            logData.error = "Error in Gtin & Gln allocation";
            console.log("Error while Gtin & Gln allocation");
            insertLog(logData);
            return gtin;
          }

          //Adding Template for rendering
          //Get the Default template
          let template_for = "manufacturer_basic"; //This need to dynamically chnaged based on the company tire
          let template = await superfiedServices.getDefaultTemplate({
            template_for: template_for,
          });
          if (template.error) {
            logData.status = "failed";
            logData.error = "Error in template creation";
            console.log("Error while getting rendering template");
            insertLog(logData);
            return template;
          }

          let template_obj = {
            template_name: template.data.template_name,
            ref_template_id: template.data.template_id,
            design: template.data.design,
            company_id: companyresp.data.company_id,
          };
          let template_resp = await superfiedServices.insertTemplate(template_obj);
          if (template_resp.error) {
            console.log(template_resp);
            logData.status = "failed";
            logData.error = "Error in template creation";
            console.log("Error while insert rendering template");
            insertLog(logData);
            return template_resp;
          }
        }


      }
      else {
        logData.status = "failed";
        logData.error = "GCP is missing";
        resp.status = false;
        resp.message = "GCP is missing";
        insertLog(logData);
        return resp;
      }

    } catch (error) {
      resp.error = true;
      resp.message = error;
      console.log(error);
      logData.status = "failed";
      logData.error = error;
      insertLog(logData);
    }
    if (logData.status != "failed" && !isExitingCompany) {
      logData.status = "success";
      insertLog(logData);
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
