const mongoose = require('mongoose');
const { addressSchema } = require('../Users/Schema');
const paymentMethods = ['cash', 'creditCard', 'cheque'];
const appointmentStatus = [
  'accepted',
  'started',
  'suspended',
  'rejected',
  'visitDone',
  'completed',
  'deferred',
  'pending',
  'viewed',
  'inActive',
];
const attachmentsSchema = new mongoose.Schema({
  data: String,
  contentType: String,
  filename: {
    type: String,
  },
  size: Number,
});
const appointmentsSchema = new mongoose.Schema(
  {
    desiredDateTime: {
      type: Number,
      required: true,
      validate: {
        validator: function (date) {
          return date >= new Date().getTime();
        },
        message: 'Appointment date must not be in the past.',
      },
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    healthcareUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    appointmentNotes: String,
    paymentMode: {
      type: String,
      enum: paymentMethods,
    },
    fees: {
      type: Number,
    },
    isPaymentReceived: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: appointmentStatus,
      default: 'pending',
    },
    attachments: {
      type: [attachmentsSchema],
    },
    address: {
      type: addressSchema,
      required: true,
    },
  },
  { timestamps: true },
);

const Appointment = mongoose.model('Appointments', appointmentsSchema);

module.exports = { Appointment, appointmentStatus };
