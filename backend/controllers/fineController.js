import { Fine, Vehicle, Rto } from '../models/index.js';

// Get all fines
export const getFines = async (req, res) => {
  try {
    const fines = await Fine.findAll({
      include: [
        {
          model: Vehicle,
          attributes: ['registrationNumber', 'ownerName', 'phoneNumber']
        },
        {
          model: Rto,
          attributes: ['name', 'code']
        }
      ]
    });
    res.json(fines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get fines by vehicle and phone number
export const getFinesByVehicle = async (req, res) => {
  try {
    const { registrationNumber, phoneNumber } = req.query;
    
    if (!registrationNumber || !phoneNumber) {
      return res.status(400).json({ message: 'Registration number and phone number are required' });
    }

    const vehicle = await Vehicle.findOne({
      where: {
        registrationNumber,
        phoneNumber
      }
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found or phone number does not match' });
    }

    const fines = await Fine.findAll({
      where: { vehicleId: vehicle.id },
      include: [
        {
          model: Vehicle,
          attributes: ['registrationNumber', 'ownerName', 'phoneNumber']
        },
        {
          model: Rto,
          attributes: ['name', 'code']
        }
      ]
    });
    res.json(fines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single fine
export const getFineById = async (req, res) => {
  try {
    const fine = await Fine.findByPk(req.params.id, {
      include: [
        {
          model: Vehicle,
          attributes: ['registrationNumber', 'ownerName', 'phoneNumber']
        },
        {
          model: Rto,
          attributes: ['name', 'code']
        }
      ]
    });
    
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
    const populatedFine = await Fine.findByPk(fine.id, {
      include: [
        {
          model: Vehicle,
          attributes: ['registrationNumber', 'ownerName', 'phoneNumber']
        },
        {
          model: Rto,
          attributes: ['name', 'code']
        }
      ]
    });
    res.status(201).json(populatedFine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update fine
export const updateFine = async (req, res) => {
  try {
    const fine = await Fine.findByPk(req.params.id);
    if (fine) {
      await fine.update(req.body);
      const updatedFine = await Fine.findByPk(req.params.id, {
        include: [
          {
            model: Vehicle,
            attributes: ['registrationNumber', 'ownerName', 'phoneNumber']
          },
          {
            model: Rto,
            attributes: ['name', 'code']
          }
        ]
      });
      res.json(updatedFine);
    } else {
      res.status(404).json({ message: 'Fine not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete fine
export const deleteFine = async (req, res) => {
  try {
    const fine = await Fine.findByPk(req.params.id);
    if (fine) {
      await fine.destroy();
      res.json({ message: 'Fine removed' });
    } else {
      res.status(404).json({ message: 'Fine not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
