import mongoose from 'mongoose';

const fineSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  rtoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rto',
    required: true
  },
  violationType: {
    type: String,
    required: true,
    enum: ['speeding', 'parking', 'signal', 'documents', 'others']
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'disputed'],
    default: 'pending'
  },
  dueDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Fine = mongoose.model('Fine', fineSchema);
export default Fine;
