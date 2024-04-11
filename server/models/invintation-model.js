const { Schema, model } = require("mongoose");

const InvitationSchema = new Schema({
  email: { type: String, unique: true, required: true },
  invitationLink: { type: String },
  referrer: {type: String}
});

module.exports = model("Invitation", InvitationSchema);
