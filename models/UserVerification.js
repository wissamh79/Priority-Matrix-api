const mongoose = require("mongoose");

const UserVerificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
    unique: true,
  },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now(), expires: 3600 }, //1 Hour
});
module.exports = mongoose.model(" UserVerification", UserVerificationSchema);
