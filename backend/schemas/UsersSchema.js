const { Schema } = require("mongoose");

const UsersSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  funds: {
    type: Number,
    default: 100000.00, // Pre-funded with 1 Lakh imaginary rupees for student simulation!
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = { UsersSchema };
