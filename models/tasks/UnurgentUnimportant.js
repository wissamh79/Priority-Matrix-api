const mongoose = require("mongoose");

const UnurgentUnimportantSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "must provide name"],
    },
    text: {
      type: String,
      // required: [true, "must provide text"],
      trim: true,
      maxlength: [250, "text can not be more than 250 characters"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "UnurgentUnimportant",
  UnurgentUnimportantSchema
);
