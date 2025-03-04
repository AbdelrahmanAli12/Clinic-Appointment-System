const express = require('express');
const app = express();
const { default: mongoose } = require('mongoose');
const checkRolePermission = require('../middleware/roleAuthorization');
const { Result, ResultOperation, isStatusValid } = require('../Common');
const {
  getAppointments,
  updateAppointment,
  deleteAppointmet,
  createAppointment,
  getAttachment,
  deleteAttachment,
} = require('./Services');
const { Appointment } = require('./Schema');
const { getUserInfo } = require('../Users/Services');
async function createAppointmentController(req, res) {
  const appointment = req.body;
  const appointmentDoc = new Appointment(appointment);
  const validationError = appointmentDoc.validateSync();

  if (validationError) {
    const result = new Result({
      operation: ResultOperation.Bad_Request,
      message: validationError.message,
    });
    return res.status(result.operation).json(result.getJsonData());
  }

  const createAppointmentResult = await createAppointment(appointment);
  return res.status(createAppointmentResult.operation).json(createAppointmentResult.getJsonData());
}

async function changesAppointmentStatus(req, res) {
  const { _id, status } = req.body;

  if (!_id || !status) {
    return res.status(ResultOperation.Bad_Request).json({
      operation: ResultOperation.Bad_Request,
      message: `Invalid Data`,
    });
  }

  if (!isStatusValid(status)) {
    return res.status(ResultOperation.Bad_Request).json({
      operation: ResultOperation.Bad_Request,
      message: `Invalid status`,
    });
  }

  const appointmentUpdateObject = {
    status: status,
  };

  try {
    const updateAppointmentStatus = await updateAppointment(_id, appointmentUpdateObject);
    res.status(updateAppointmentStatus.operation).json(updateAppointmentStatus.getJsonData());
  } catch (error) {
    const result = new Result({
      operation: ResultOperation.Server_Error,
      message: 'API failure',
      data: error,
    });
    res.status(result.operation).json(result.getJsonData());
  }
}

async function getAppointmentsController(req, res) {
  try {
    let reqQueries = req.query ? Object.keys(req.query) : [];
    let queryLimit = 999999;
    let recent;
    if (reqQueries.includes('limit')) {
      queryLimit = Number(req.query.limit);
      reqQueries = reqQueries.filter((query) => query !== 'limit');
    }
    if (reqQueries.includes('mostRecent')) {
      recent = req.query.mostRecent;
      reqQueries = reqQueries.filter((query) => query !== 'mostRecent');
    }
    const filterItems = [
      '_id',
      'patient',
      'healthcareUser',
      'status',
      'paymentMode',
      'healthcareUserInfo._id',
      'patientInfo._id',
    ];
    const filterIdItems = [
      '_id',
      'patient',
      'healthcareUser',
      'healthcareUserInfo._id',
      'patientInfo._id',
    ];

    const inValidQueries = reqQueries.filter((queryItem) => !filterItems.includes(queryItem));

    const isReqQueryValid = inValidQueries.length === 0;

    if (!isReqQueryValid) {
      const result = new Result({
        operation: ResultOperation.Bad_Request,
        message: `${inValidQueries} is not a valid query paramters`,
      });
      return res.status(result.operation).json(result.getJsonData());
    }

    let appointmenetFilter = {};

    reqQueries.forEach((item) =>
      filterIdItems.includes(item)
        ? (appointmenetFilter[item] = new mongoose.Types.ObjectId(req.query[item]))
        : (appointmenetFilter[item] = req.query[item]),
    );
    const appointmentsResult = await getAppointments(appointmenetFilter, queryLimit, recent);
    res.status(appointmentsResult.operation).json(appointmentsResult.getJsonData());
  } catch (error) {
    console.log('Error at getAppointment controller ', error);
    const result = new Result({
      operation: ResultOperation.Failure,
      message: `Failed to get appointments, ${error}`,
      data: JSON.stringify(error.message),
    });
    return res.status(result.operation).json(result.getJsonData());
  }
}

async function assignHealthcareUserToAppointment(req, res) {
  const { _id, healthcareUserId } = req.body;
  if (!_id || !healthcareUserId) {
    return res.status(ResultOperation.Bad_Request).json({
      operation: ResultOperation.Bad_Request,
      message: `Invalid Data`,
    });
  }
  const healthcareUserCheck = await getUserInfo(healthcareUserId);
  if (!healthcareUserCheck.isSuccess) {
    return res.status(healthcareUserCheck.operation).json(healthcareUserCheck.getJsonData());
  }
  const appointmentUpdateObject = {
    healthcareUser: new mongoose.Types.ObjectId(healthcareUserId),
  };
  const assignAppointment = await updateAppointment(_id, appointmentUpdateObject);
  res.status(assignAppointment.operation).json(assignAppointment.getJsonData());
}

async function deleteAppointmentController(req, res) {
  const id = req.params.id;
  if (!id) {
    const result = new Result({
      operation: ResultOperation.Bad_Request,
      message: 'Appointment id not provided',
    });
    return res.status(result.operation).json(result.getJsonData());
  }
  const deleteApppointmentResult = await deleteAppointmet(id);

  return res
    .status(deleteApppointmentResult.operation)
    .json(deleteApppointmentResult.getJsonData());
}

async function AppointmentAdvancedFilter(req, res) {
  const {
    duration,
    status,
    healthcareUserName,
    patientName,
    patientCountry,
    healthcareUserCountry,
  } = req.body;
  let appointmentFilter = {};
  let startDate, endDate;
  const currentDate = new Date();

  if (duration) {
    switch (duration) {
      case 'today':
        startDate = new Date(currentDate);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(currentDate);
        endDate.setHours(23, 59, 59, 0);
        break;
      case 'current-week':
        const today = currentDate.getDay();
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - today);
        endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() + (6 - today));
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'current-month':
        startDate = new Date(currentDate);
        startDate.setDate(1);
        endDate = new Date(currentDate);
        endDate.setMonth(currentDate.getMonth() + 1);
        endDate.setDate(0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'current-year':
        startDate = new Date(currentDate);
        startDate.setMonth(0);
        startDate.setDate(1);
        endDate = new Date(currentDate);
        endDate.setMonth(11);
        endDate.setDate(31);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'past-week':
        const daysSinceMonday = (currentDate.getDay() + 6) % 7;
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - daysSinceMonday - 7);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'past-month':
        startDate = new Date(currentDate);
        startDate.setMonth(currentDate.getMonth() - 1);
        startDate.setDate(1);
        endDate = new Date(currentDate);
        endDate.setDate(0);
        endDate.setMonth(currentDate.getMonth() - 1);
        break;
      case 'past-year':
        startDate = new Date(currentDate);
        startDate.setFullYear(currentDate.getFullYear() - 1);
        startDate.setMonth(0);
        endDate = new Date(currentDate);
        endDate.setFullYear(currentDate.getFullYear() - 1);
        endDate.setMonth(11);
        endDate.setDate(31);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'next-week':
        const daysUntilNextMonday = (8 - currentDate.getDay()) % 7;
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() + daysUntilNextMonday);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'next-month':
        startDate = new Date(currentDate);
        startDate.setMonth(currentDate.getMonth() + 1);
        startDate.setDate(1);
        endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);
        endDate.setDate(0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'next-year':
        startDate = new Date(currentDate);
        startDate.setFullYear(currentDate.getFullYear() + 1);
        startDate.setMonth(0);
        endDate = new Date(startDate);
        endDate.setFullYear(startDate.getFullYear() + 1);
        endDate.setMonth(11);
        endDate.setDate(31);
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        const result = new Result({
          operation: ResultOperation.Bad_Request,
          message: 'Duration is invalid',
        });
        return res.status(result.operation).json(result.getJsonData());
    }
    appointmentFilter['desiredDateTime'] = {
      $gte: new Date(startDate).getTime(),
      $lte: new Date(endDate).getTime(),
    };
  }
  if (patientName) {
    const regex = new RegExp(patientName, 'i');
    appointmentFilter['patientInfo.name'] = { $regex: regex };
  }
  if (healthcareUserName) {
    const regex = new RegExp(healthcareUserName, 'i');
    appointmentFilter['healthcareUserInfo.name'] = { $regex: regex };
  }

  if (healthcareUserCountry) {
    const regex = new RegExp(healthcareUserCountry, 'i');
    appointmentFilter['healthcareUserInfo.address.country'] = { $regex: regex };
  }

  if (patientCountry) {
    const regex = new RegExp(patientCountry, 'i');
    appointmentFilter['patientInfo.address.country'] = { $regex: regex };
  }

  if (status) {
    appointmentFilter['status'] = status;
  }
  const result = await getAppointments(appointmentFilter);
  res.status(result.operation).json(result.getJsonData());
}

async function updateAppointmentController(req, res) {
  try {
    const reqBody = req.body;
    const { _id } = reqBody;
    if (!_id) {
      const result = new Result({
        operation: ResultOperation.Bad_Request,
        message: 'Invalid appointment id',
      });
      return res.status(result.operation).json(result.getJsonData());
    }

    delete reqBody._id;
    const updateAppointmentResult = await updateAppointment(_id, reqBody);
    res.status(updateAppointmentResult.operation).json(updateAppointmentResult.getJsonData());
  } catch (error) {
    const result = new Result({
      operation: ResultOperation.Server_Error,
      message: 'API failure',
      data: error,
    });
    res.status(result.operation).json(result.getJsonData());
  }
}

async function uploadAttachment(req, res) {
  try {
    const reqBody = req.body;
    const { _id } = reqBody;
    if (!_id) {
      const result = new Result({
        operation: ResultOperation.Bad_Request,
        message: 'Invalid appointment id',
      });
      return res.status(result.operation).json(result.getJsonData());
    }

    delete reqBody._id;
    const updateAppointmentResult = await updateAppointment(_id, reqBody, '$push');
    res.status(updateAppointmentResult.operation).json(updateAppointmentResult.getJsonData());
  } catch (error) {
    const result = new Result({
      operation: ResultOperation.Server_Error,
      message: 'API failure',
      data: JSON.stringify(error),
    });
    res.status(result.operation).json(result.getJsonData());
  }
}
async function fetchAttachment(req, res) {
  const { _id, filename } = req.query;
  if (!_id || !filename) {
    const result = new Result({
      operation: ResultOperation.Bad_Request,
      message: 'Invalid data',
    });
    return res.status(result.operation).json(result.getJsonData());
  }
  try {
    const resultAttachment = await getAttachment(_id, filename);
    return res.status(resultAttachment.operation).json(resultAttachment.getJsonData());
  } catch (error) {
    const result = new Result({
      operation: ResultOperation.Failure,
      message: `Failed to get attachment, ${error}`,
      data: JSON.stringify(error.message),
    });
    return res.status(result.operation).json(result.getJsonData());
  }
}
async function removeAttachment(req, res) {
  const { _id, attachmentsId } = req.query;
  if (!_id || !attachmentsId) {
    const result = new Result({
      operation: ResultOperation.Bad_Request,
      message: 'Invalid data',
    });
    return res.status(result.operation).json(result.getJsonData());
  }
  try {
    const resultAttachment = await deleteAttachment(_id, attachmentsId);
    return res.status(resultAttachment.operation).json(resultAttachment.getJsonData());
  } catch (error) {
    const result = new Result({
      operation: ResultOperation.Failure,
      message: `Failed to delete attachment, ${error}`,
      data: JSON.stringify(error.message),
    });
    return res.status(result.operation).json(result.getJsonData());
  }
}

app.put(
  '/attachment',
  checkRolePermission(['admin:update', 'healthcareUser:update', 'scheduler:update']),
  uploadAttachment,
);
app.get(
  '/attachment',
  checkRolePermission(['admin:read', 'healthcareUser:read', 'scheduler:read']),
  fetchAttachment,
);
app.delete(
  '/attachment',
  checkRolePermission(['admin:delete', 'scheduler:delete']),
  removeAttachment,
);
app.post(
  '/',
  checkRolePermission(['admin:create', 'scheduler:create']),
  createAppointmentController,
);

app.get(
  '/',
  checkRolePermission(['admin:read', 'scheduler:read', 'healthcareUser:read', 'accountant:read']),
  getAppointmentsController,
);

app.post(
  '/advancedFilter',
  checkRolePermission(['admin:read', 'scheduler:read', 'healthcareUser:read', 'accountant:read']),
  AppointmentAdvancedFilter,
);

app.put(
  '/changeAppointmentStatus',
  checkRolePermission(['admin:update', 'healthcareUser:update', 'scheduler:update']),
  changesAppointmentStatus,
);

app.put(
  '/',
  checkRolePermission(['admin:update', 'healthcareUser:update', 'scheduler:update']),
  updateAppointmentController,
);

app.delete(
  '/:id',
  checkRolePermission(['admin:update', 'scheduler:update']),
  deleteAppointmentController,
);

app.put(
  '/assignAppointmentToHealthcareUser',
  checkRolePermission(['admin:update', 'scheduler:update']),
  assignHealthcareUserToAppointment,
);
module.exports = app;
