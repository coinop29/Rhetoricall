const mongoose = require("mongoose");

// const { MongoClient, ObjectId } = require("mongodb");
//
const backgroundVideoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  filename: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

module.exports = mongoose.model("BackgroundVideo", backgroundVideoSchema);
