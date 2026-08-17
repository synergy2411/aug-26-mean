import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  mobileNumber: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date, required: true }
}, {
  timestamps: true
});

const User = model('User', userSchema);

export default User;