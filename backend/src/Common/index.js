const { default: mongoose } = require('mongoose');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();
const secretKey = process.env.ENCRYPT_SECRET_KEY;
const iv = Buffer.alloc(16, 0);

async function encryptData(data) {
  try {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
    let encryptedData = cipher.update(data, 'utf8', 'base64');
    encryptedData += cipher.final('base64');
    return encryptedData;
  } catch (error) {
    throw new Error('Encryption failed: ' + error.message);
  }
}
async function decryptData(encryptedData) {
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
    let decryptedData = decipher.update(encryptedData, 'base64', 'utf8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
  } catch (error) {
    throw new Error('Decryption failed: ' + error.message);
  }
}
class Result {
  constructor({ operation, message = '', data = null }) {
    this.operation = operation;
    this.message = message;
    this.data = data;
    this.isSuccess = operation === 200 ? true : false;
  }

  getJsonData() {
    // let jsonData = {};
    // if (this.message) jsonData["message"] = ;
    // if (this.data) jsonData["data"] = ;

    return {
      message: this.message,
      data: this.data,
    };
  }
}

const ResultOperation = {
  Failure: 500,
  Not_Found: 404,
  Unauthorized: 401,
  Bad_Request: 400,
  Forbidden: 403,
  Success: 200,
  Server_Error: 502,
  Conflict: 409,
};

const GlobalUserRoles = {
  Admin: 'admin',
  Scheduler: 'scheduler',
  HealthcareUser: 'healthcareUser',
  Accountant: 'accountant',
  Patient: 'patient',
};

const GlobalPaymentMethods = {
  Cash: 'cash',
  Credit_Card: 'creditCard',
  Cheque: 'cheque',
};

const GlobalAppointmentStatus = {
  Accepted: 'accepted',
  Started: 'started',
  Suspended: 'suspended',
  Rejected: 'rejected',
  VisitDone: 'visitDone',
  Completed: 'completed',
  Deffered: 'deferred',
  Pending: 'pending',
  Viewed: 'viewed',
  InActive: 'inActive',
};

function getUserRoles() {
  return Object.values(GlobalUserRoles);
}
function getAppointmentStatuses() {
  return Object.values(GlobalAppointmentStatus);
}
function getPaymentMenthods() {
  return Object.values(GlobalPaymentMethods);
}

function isRoleValid(role) {
  const userRoles = getUserRoles();
  return userRoles.includes(role);
}

function isStatusValid(status) {
  const appointmentStatus = getAppointmentStatuses();

  return appointmentStatus.includes(status);
}

const LoggedInUser = (function () {
  let instance; // Private instance variable

  function createInstance(loggedInUserObject = null) {
    if (!loggedInUserObject) return instance;
    return loggedInUserObject;
  }

  return {
    getInstance: function (loggedInUserObject = null) {
      if (loggedInUserObject) {
        instance = createInstance(loggedInUserObject);
      }
      return instance;
    },
  };
})();

function getSecuredAppointmentsQuery(getCompleted = false) {
  // This part is responsible to make sure that the appointments retrieved are the ones under user permission

  const loggedInUser = LoggedInUser.getInstance();
  const userRole = loggedInUser.role;
  let query = getCompleted
    ? { status: GlobalAppointmentStatus.Completed }
    : { status: { $nin: [GlobalAppointmentStatus.Completed, GlobalAppointmentStatus.InActive] } };
  if (userRole === GlobalUserRoles.HealthcareUser) {
    query['healthcareUser'] = new mongoose.Types.ObjectId(loggedInUser.userId);
  } else if (userRole === GlobalUserRoles.Accountant) {
    query['status'] = GlobalAppointmentStatus.Completed;
  } else if (userRole === GlobalUserRoles.Patient) {
    query['patient'] = new mongoose.Types.ObjectId(loggedInUser.userId);
  }

  return query;
}

module.exports = {
  Result,
  ResultOperation,
  GlobalUserRoles,
  isRoleValid,
  getUserRoles,
  GlobalPaymentMethods,
  GlobalAppointmentStatus,
  getAppointmentStatuses,
  getPaymentMenthods,
  LoggedInUser,
  isStatusValid,
  getSecuredAppointmentsQuery,
  encryptData,
  decryptData,
};
