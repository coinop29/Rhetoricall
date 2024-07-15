const mongoose = require("mongoose");

// const { MongoClient, ObjectId } = require("mongodb");
//
const backgroundSchema = new mongoose.Schema({
  url: { type: String, required: true },
  filename: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const Background = mongoose.model("Background", backgroundSchema);
module.exports = Background;
