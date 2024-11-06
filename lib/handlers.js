let tenantServices = require("./services/tenant.js");
let gsonekeyServices = require("./services/gsonekeys.js");
let superfiedServices = require("./services/superfields.js");
let userService = require("./services/user.js");
let config = require("../config/config.js");
const snsSrc = require("./services/wowsns.js");

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
      user_email: p.contact_details.contact_email.toLowerCase(),
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
      user_email: p.contact_details.contact_email.toLowerCase(),
      user_phone: p.contact_details.contact_phone,
      user_designation: p.contact_details.contact_designation,
      user_status: true,
      is_primary_user: true,
      toc_status: true,
      toc_date: new Date(Date.now())
    };
    userService.processGcpUserUpdate(user_obj);
  }

  let sendMail = (p) => {
    let mailObj = {
      tenant_id: 100, //Default tenant
      notification_code: "ZOHO_SYNC",
      sendParams: {
        send_to: ["ashokkumar@hakunamatatatech.com"],
        params: {
          gcp: p.gcp,
          issue: p.issue,
        },
      },
    };
    //Enable it while moving to production
    let sendMail = snsSrc.sendSNS(mailObj);
  }

  

  handler.syncGCP = async (p) => {
    let resp = {
      error: false,
    };
    
    let isExitingCompany = false;

    let logData = {};
    try {
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

      // // Check mandatory fields
      // const requiredFields = [
      //   "company_name", "gcp", "activation_date", "expiry_date",
      //   "company_status","registration_type","company_pincode","company_address",
      //   "company_state","company_city",
      //   "company_country","contact_details.contact_name",
      //   "contact_details.contact_email", "contact_details.contact_designation",
      //   "contact_details.contact_phone"
      // ];

    // for (const field of requiredFields) {
    //   const value = field.split('.').reduce((o, key) => o?.[key], p);
    //   if (!value) {
    //     logData.status = "failed";
    //     logData.error = `${field} is missing`;
    //     resp.status = false;
    //     resp.errorCode = "EZ-03";
    //     resp.message = `${field} is missing`;
    //     resp.DK_2_0_Value_Success = `${resp.errorCode} ${resp.message}`;
    //     insertLog(logData);
    //     return resp;
    //   }
    // }
      // Create or update company
      
      // check gcp exists already
      if (p.gcp) {
        let company_obj = {
          gcp: p.gcp,
          company_name: p.company_name,
          company_email: p.contact_details.contact_email.toLowerCase(),
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
          // pincode : p.company_pincode
        };
        let companyresp = await tenantServices.insertCompany(company_obj);
        if (companyresp.error) {
          console.log(companyresp);
          let respData = {};
          if(companyresp.isEmailAccountIssue)
          {
            logData.status = "failed";
            logData.error = "Error due to same email for different account";
            insertLog(logData);
            respData.status = false;
            respData.errorCode = "EZ-01"
            respData.message = "Error due to same email for different account"
            respData.DK_2_0_Value_Success = `${ respData.errorCode} ${respData.message}`;
            console.log("Error while insert company details");
          }
          else
          {
            logData.status = "failed";
            logData.error = "Error in company creation";
            insertLog(logData);
            respData.errorCode = "EDK-01"
            respData.status = false;
            respData.message = "Company Creation Failed"
            respData.DK_2_0_Value_Success = `${ respData.errorCode} ${respData.message}`;
            console.log("Error while insert company details");
          }
          //sendMail
          return respData;
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

        let user_obj = {
          id: nanoid(10),
          company_id: companyresp.data.company_id,
          user_name: p.contact_details.contact_name,
          user_email: p.contact_details.contact_email.toLowerCase(),
          user_phone: p.contact_details.contact_phone,
          user_designation: p.contact_details.contact_designation,
          user_status: true,
          is_primary_user: true,
          gcp : p.gcp,
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
          //respData.DK_2_0_Value_Success = `${ respData.errorCode} ${respData.message}`;
          return { status: false, message: "Error while Creating user details","errorCode":"EDK-02",DK_2_0_Value_Success:"EDK-02 Error while Creating user details" };
          
        }

          // Create a new contact
          let contact_obj = {
            id: nanoid(10),
            gcp : p.gcp,
            company_id: companyresp.data.company_id,
            contact_name: p.contact_details.contact_name,
            contact_email: p.contact_details.contact_email.toLowerCase(),
            contact_phone: p.contact_details.contact_phone,
            contact_designation: p.contact_details.contact_designation,
            contact_type: "primary",
            contact_status: true,
            gcp : p.gcp,
            user_id: userresp.data.id,
            creator_id: userresp.data.id,
            // contact_address: p.company_address,
            // contact_city: p.company_city,
            // contact_state: p.company_state,
            // contact_country: p.company_country,
            // contact_pincode:p.company_pincode
          };
          let contactresp = await tenantServices.insertContact(contact_obj);
          if (contactresp.error) {
            console.log(contactresp);
            logData.status = "failed";
            logData.error = "Error in contact creation - " + contactresp.message;
            console.log("Error while insert contact details");
            insertLog(logData);
            respData.DK_2_0_Value_Success = `${ respData.errorCode} ${respData.message}`;
            contactresp.status = false;
            contactresp.message = "Creating Company contact details";
            contactresp.errorCode = "EDK-03";
            contactresp.DK_2_0_Value_Success = `${contactresp.errorCode} ${contactresp.message}`;
            return contactresp;
          }


        if (companyresp.is_multiple_gcp) {
          logData.status = "failed";
          logData.error = "Multiple GCP";
          processMultipleGcp(p,companyresp.data.company_id,p.gcp);
          //return { status: true, message: "Sucess" };
        }
        
         


        
        else
        {
          // if existing company then update the contact details
          processGcpUserUpdate(p,companyresp.data.company_id,p.gcp);
        }


        //create a new User

        // Create a new GCP or update expiry date for existing
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
          gcpresp.status = false;
          gcpresp.errorCode = "EDK-04"
          gcpresp.message = "Error in GCP Creation";
          gcpresp.DK_2_0_Value_Success = `${gcpresp.errorCode} ${gcpresp.message}`
          return gcpresp;
        }

       

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
            gtin.status = false;
            gtin.errorCode = "EDK-05"
            gtin.message = "Error in GTIN and GLN allocation";
            gtin.DK_2_0_Value_Success = `${gtin.errorCode} ${gtin.message}`
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
            template.status = false;
            template.errorCode = "EDK-07";
            template.message = "Error in Rendering Template Creation";
            template.DK_2_0_Value_Success = `${template.errorCode} ${template.message}`
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
            template_resp.status = false;
            template_resp.errorCode = "EDK-07"
            template_resp.message = "Error in Rendering Template Creation";
            template_resp.DK_2_0_Value_Success = `${template_resp.errorCode} ${template_resp.message}`
            return template_resp;
          }
        }


      }
      else {
        logData.status = "failed";
        logData.error = "GCP is missing";
        resp.status = false;
        resp.errorCode = "EZ-02"
        resp.message = "GCP is missing";
        resp.DK_2_0_Value_Success = `${resp.errorCode} ${resp.message}`
        insertLog(logData);
        return resp;
      }

    } catch (error) {
      resp.error = true;
      resp.message = error;
      console.log(error);
      logData.status = "failed";
      resp.DK_2_0_Value_Success = "Fail";
      logData.error = error;
      insertLog(logData);
    }
    if (logData.status != "failed") {
      logData.status = "success";
      insertLog(logData);
      resp.DK_2_0_Value_Success ="Yes";
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
