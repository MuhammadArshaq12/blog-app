import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phoneNumber: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  verificationToken: {
    type: String, // to store the unique token
  },
  isVerified: {
    type: Boolean,
    default: false, // to store the verification status
  },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
