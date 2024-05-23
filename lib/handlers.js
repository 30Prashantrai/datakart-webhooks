let tenantServices = require("./services/tenant.js");
let gsonekeyServices = require("./services/gsonekeys.js");
let userService = require("./services/user.js");
const dayjs = require("dayjs");
const { customAlphabet } = require("nanoid"),
  nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10),
  customNumber = customAlphabet("1234567890", 9);

function configureHandler(fastify) {
  let handler = {};

  handler.syncGCP = async (p) => {
    let resp = {
      error: false,
    };
    try {
      let gcp_obj = {
        gcp: p.gcp,
        account_id: p.account_id,
      };
      let gcpresp = await gsonekeyServices.getGcp(gcp_obj);
      if (gcpresp.error) {
        return gcpresp;
      }
      let gcp = gcpresp.data;
      console.log(gcp);
      if (gcp.length > 0) {
        //GCP already exists
        //Update company details for now
        let obj = {
          company_id: gcp[0].company_id,
        };
        let companyresp = await tenantServices.getCompanyDetails(obj);
        if (companyresp.error) {
          return companyresp;
        }

        let company = companyresp.data;
        console.log(company);
        let company_obj = {
          company_id: company.company_id,
          company_name: p.company_name,
          company_email: p.contact_details.contact_email,
          company_city: p.company_city,
          company_state: p.company_state,
          company_country: p.company_country,
          company_phone: p.contact_details.contact_phone,
          activation_date: dayjs(p.activation_date).format("YYYY-MM-DD"),
          expiry_date: dayjs(p.expiry_date).format("YYYY-MM-DD"),
          address1: p.company_address,
        };
        let updateresp = await tenantServices.updateCompany(company_obj);
        if (updateresp.error) {
          return updateresp;
        }
      } else {
        // Create a new company
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
          return companyresp;
        }

        //create a new User
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
        };
        let userresp = await userService.insertUser(user_obj);
        if (userresp.error) {
          return userresp;
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
          return contactresp;
        }

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
          return gcpresp;
        }

        //Gtin Allocation
      }
    } catch (error) {
      resp.error = true;
      resp.message = error;
      console.log(error);
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
