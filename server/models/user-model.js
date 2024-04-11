const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
 
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  role: { type: String, required: true, default: "User" },
  activationLink: { type: String }, //link to user activation
  name: { type: String },
  lastName: { type: String },
  //   state: { type: String },
  profession: { type: String },
  phone: { type: Number },
  city: { type: String },
  birthDate: { type: Date },
  currentWork: { type: String },
  institute: { type: String },
  interests: { type: String },
  about: { type: String },
  imageUrl: { type: String },
  //roles: [{ type: String, enum: ['admin', 'user'], default: 'user' }],
  referrer:{type:String},
  company: { type: String },
  rewards: [
    {
      name: String,
      description: String,
      points: Number,
    },
  ],
});

module.exports = model("User", UserSchema);
