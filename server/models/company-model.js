const { Schema, model } = require("mongoose");

const CompanySchema = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  type: { type: String },
  industry: { type: String },
  city: { type: String },
  description: { type: String },
  logo: { type: String },
  tags: { type: [String], default: [] },
  confirmed: { type: Boolean, default: false },
});

module.exports = model("Company", CompanySchema);
