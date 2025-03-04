const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  postalCode: String,
  zipCode: {
    type: String,
    required: true,
  },
  country: String,
  villaBuildingNum: String,
  floorNum: String,
  appartmentNum: String,
  extraDirections: String,
});

const roles = ['admin', 'scheduler', 'healthcareUser', 'accountant', 'patient'];
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  },
  role: {
    type: String,
    enum: roles,
    required: true,
  },
  dateOfBirth: {
    type: Number,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  address: {
    type: [addressSchema],
    required: true,
  },
});

const updateUserSchema = new mongoose.Schema({
  password: {
    type: String,
  },
  name: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  },
  active: {
    type: Boolean,
    default: true,
  },
  address: {
    type: [addressSchema],
  },
});

const User = mongoose.model('User', userSchema);
const UpdateUserSchema = mongoose.model('UpdateUserSchema', updateUserSchema);

module.exports = { User, addressSchema, UpdateUserSchema };
