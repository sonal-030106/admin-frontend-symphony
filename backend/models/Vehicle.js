import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String,
    required: true,
  },
  registrationDate: {
    type: Date,
    required: true,
  },
  insuranceExpiry: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'suspended'],
    default: 'active',
  }
}, {
  timestamps: true
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
