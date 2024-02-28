import { Schema, model } from "mongoose";

const userSchema = new Schema({
  userName: { type: String, required: true },
  emailId: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default model("Users", userSchema);
