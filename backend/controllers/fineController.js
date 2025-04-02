import Fine from '../models/Fine.js';

// Get all fines
export const getFines = async (req, res) => {
  try {
    const fines = await Fine.find({})
      .populate('vehicleId', 'registrationNumber ownerName')
      .populate('rtoId', 'name code');
    res.json(fines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get fines by vehicle
export const getFinesByVehicle = async (req, res) => {
  try {
    const fines = await Fine.find({ vehicleId: req.params.vehicleId })
      .populate('vehicleId', 'registrationNumber ownerName')
      .populate('rtoId', 'name code');
    res.json(fines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single fine
export const getFineById = async (req, res) => {
  try {
    const fine = await Fine.findById(req.params.id)
      .populate('vehicleId', 'registrationNumber ownerName')
      .populate('rtoId', 'name code');
    if (fine) {
      res.json(fine);
    } else {
      res.status(404).json({ message: 'Fine not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create fine
export const createFine = async (req, res) => {
  try {
    const fine = await Fine.create(req.body);
    const populatedFine = await Fine.findById(fine._id)
      .populate('vehicleId', 'registrationNumber ownerName')
      .populate('rtoId', 'name code');
    res.status(201).json(populatedFine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update fine
export const updateFine = async (req, res) => {
  try {
    const fine = await Fine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    .populate('vehicleId', 'registrationNumber ownerName')
    .populate('rtoId', 'name code');
    
    if (fine) {
      res.json(fine);
    } else {
      res.status(404).json({ message: 'Fine not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete fine
export const deleteFine = async (req, res) => {
  try {
    const fine = await Fine.findByIdAndDelete(req.params.id);
    if (fine) {
      res.json({ message: 'Fine removed' });
    } else {
      res.status(404).json({ message: 'Fine not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
