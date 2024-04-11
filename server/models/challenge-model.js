const { Schema, model } = require("mongoose");

const roundSchema = new Schema({
  roundName: String,
  roundDate: String,
});

const ChallengeSchema = new Schema({
  description: { type: String, required: true },
  // done: { type: Boolean, required: true },
  status: {
    type: String,
    enum: ["backlog", "inProgress", "done"],
    default: "backlog",
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: false }, //referense to user
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },

  imageUrl: {
    type: String,
  },
  price: {
    type: String,
  },
  firstPlace: {
    type: String,
  },
  secondPlace: {
    type: String,
  },
  thirdPlace: {
    type: String,
  },
  startDate: {
    type: String,
  },
  lastRegisterDate: {
    type: String,
  },
  roundname: {
    type: String,
  },
  endDate: {
    type: String,
  },
  roundsData: {
    type: [roundSchema],
  },
  primary: {
    type: String,
  },
  secondary: {
    type: String,
  },
  profession: {
    type: String,
  },
  level: {
    type: String,
  },
  industry: {
    type: String,
  },
  methodology: {
    type: String,
  },
  tool: {
    type: String,
  },
  points: {
    type: String,
  },
  fileDescription: {
    type: String,
  },
  fileTitle: {
    type: String,
  },
  rules: {
    type: String,
  },
});

module.exports = model("Challenge", ChallengeSchema);
