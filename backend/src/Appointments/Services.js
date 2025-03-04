const { Appointment } = require('./Schema');
const { default: mongoose } = require('mongoose');
const {
  ResultOperation,
  Result,
  GlobalAppointmentStatus,
  GlobalUserRoles,
  LoggedInUser,
  isRoleValid,
  getSecuredAppointmentsQuery,
  encryptData,
  decryptData,
} = require('../Common');

async function createAppointment(appointment) {
  try {
    if (!appointment)
      return new Result({
        operation: ResultOperation.Bad_Request,
        message: 'Invalid appointment body',
      });

    const createAppointmentResult = await Appointment.create(appointment);
    if (!createAppointmentResult._id) {
      return new Result({
        operation: ResultOperation.Failure,
        message: `Failed to create appointment`,
        data: JSON.stringify(createAppointmentResult.$erros),
      });
    }

    return new Result({
      operation: ResultOperation.Success,
      message: `Appointment created successfully and scheduled to ${new Date(
        appointment.desiredDateTime,
      ).toISOString()}`,
    });
  } catch (error) {
    return new Result({
      operation: ResultOperation.Bad_Request,
      message: `Api Failure : failed to create appointment : ${error}`,
      data: error,
    });
  }
}

async function getAppointments(appointmenetFilter = null, limit = 999999, recent) {
  try {
    const loggedInUser = LoggedInUser.getInstance();
    if (!loggedInUser) {
      return new Result({
        operation: ResultOperation.Unauthorized,
        message: 'Invalid User',
      });
    }

    const userRole = loggedInUser.role;
    if (!isRoleValid(userRole)) {
      return new Result({
        operation: ResultOperation.Unauthorized,
        message: 'Invalid Role',
      });
    }
    let getCompleted =
      appointmenetFilter?.status &&
      appointmenetFilter?.status === GlobalAppointmentStatus.Completed;

    let query = getSecuredAppointmentsQuery(getCompleted);

    if (appointmenetFilter) {
      query = { ...query, ...appointmenetFilter };
    }
    let sortType = {};
    if (recent) {
      sortType = { createdAt: -1 };
    } else {
      sortType = { desiredDateTime: -1 };
    }
    const pipeline = [
      {
        $lookup: {
          from: 'users',
          localField: 'patient',
          foreignField: '_id',
          as: 'patientInfo',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'healthcareUser',
          foreignField: '_id',
          as: 'healthcareUserInfo',
        },
      },
      {
        $unwind: {
          path: '$patientInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$healthcareUserInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: query,
      },
      {
        $limit: limit,
      },
      {
        $sort: sortType,
      },
    ];

    if (getCompleted) {
      pipeline.push({
        $project: {
          'healthcareUserInfo.name': 1,
          'patientInfo.name': 1,
          'address.zipCode': 1,
          status: 1,
          fees: 1,
          paymentMode: 1,
          isPaymentReceived: 1,
          desiredDateTime: 1,
        },
      });
    } else {
      pipeline.push({
        $project: {
          'healthcareUserInfo.password': 0,
          'patientInfo.password': 0,
          'attachments.data': 0,
        },
      });
    }

    const appointmentResult = await Appointment.aggregate(pipeline).exec();

    if (appointmentResult) {
      return new Result({
        operation: ResultOperation.Success,
        data: appointmentResult,
      });
    }

    return new Result({
      operation: ResultOperation.Failure,
      message: 'API failure: Failed to get appointments',
    });
  } catch (error) {
    return new Result({
      operation: ResultOperation.Failure,
      message: `API failure: Failed to get appointments, ${error.message}`,
      data: JSON.stringify(error),
    });
  }
}

async function updateAppointment(appointmentId, updateObj, mongooseAction = '$set') {
  try {
    const loggedInUser = LoggedInUser.getInstance();
    let query = { _id: new mongoose.Types.ObjectId(appointmentId) };

    if (loggedInUser.role == GlobalUserRoles.HealthcareUser) {
      query['healthcareUser'] = new mongoose.Types.ObjectId(loggedInUser.userId);
    }
    if (updateObj.attachments && updateObj.attachments[0].data) {
      const base64Data = updateObj.attachments[0].data;
      updateObj.attachments[0].data = await encryptData(base64Data);
    }
    const result = await Appointment.updateOne(
      query,
      { [mongooseAction]: updateObj },
      { runValidators: true },
    );
    if (result.matchedCount === 0)
      return new Result({
        operation: ResultOperation.Not_Found,
        message: `Appointment not found`,
      });
    return new Result({
      operation: ResultOperation.Success,
      message: `Appointment(s) field(s) updated`,
    });
  } catch (error) {
    return new Result({
      operation: ResultOperation.Server_Error,
      message: 'API Error',
      data: JSON.stringify(error),
    });
  }
}

async function deleteAppointmet(appointmentId) {
  try {
    const deleteApppointmentResult = await updateAppointment(appointmentId, {
      status: GlobalAppointmentStatus.InActive,
    });

    if (!deleteApppointmentResult.isSuccess) {
      return new Result({
        operation: ResultOperation.Failure,
        message: `Failed to delete appointment ${deleteApppointmentResult.data}`,
        data: deleteApppointmentResult.data ?? null,
      });
    }

    return new Result({
      operation: ResultOperation.Success,
      message: `Appointment with id ${appointmentId} successfully`,
    });
  } catch (error) {
    return new Result({
      operation: ResultOperation.Failure,
      message: `Failed to delete appointment ${error.message ?? ''}`,
      data: JSON.stringify(error),
    });
  }
}
async function getAttachment(id, filename) {
  try {
    const appointmentId = new mongoose.Types.ObjectId(id);
    const attachment = await Appointment.findOne(
      { _id: appointmentId, 'attachments.filename': filename },
      { 'attachments.$': 1 },
    );
    if (!attachment) {
      return new Result({
        operation: ResultOperation.Not_Found,
        message: 'Attachment not found',
      });
    }
    if (attachment.attachments && attachment.attachments[0].data) {
      const dycrepted = await decryptData(attachment.attachments[0].data);
      attachment.attachments[0].data = dycrepted;
    }
    return new Result({
      operation: ResultOperation.Success,
      data: attachment,
    });
  } catch (error) {
    return new Result({
      operation: ResultOperation.Failure,
      message: `Failed to get attachment, ${error}`,
      data: JSON.stringify(error.message),
    });
  }
}
async function deleteAttachment(id, attachmentId) {
  try {
    const appointmentId = new mongoose.Types.ObjectId(id);
    const fileId = new mongoose.Types.ObjectId(attachmentId);
    const result = await Appointment.findOneAndUpdate(
      { _id: appointmentId, 'attachments._id': fileId },
      { $pull: { attachments: { _id: fileId } } },
      { new: true },
    );
    if (!result) {
      return new Result({
        operation: ResultOperation.Not_Found,
        message: 'Attachment not found',
      });
    }
    return new Result({
      operation: ResultOperation.Success,
      message: 'Attachment deleted successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error at deleteAttachment controller ', error);
    return new Result({
      operation: ResultOperation.Failure,
      message: `Failed to delete attachment: ${error}`,
      data: JSON.stringify(error.message),
    });
  }
}

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointmet,
  getAttachment,
  deleteAttachment,
};
