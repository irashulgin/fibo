const { Schema, model } = require("mongoose");

const FileSchema = new Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  // user: { type: Schema.Types.ObjectId, ref: "User", required: false }, //referense to user
  data: { type: Buffer, required: true },
  email: { type: String },
});

module.exports = model("File", FileSchema);
