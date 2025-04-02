import axios from 'axios';

const API_URL = 'http://localhost:5003/api';

export const api = axios.create({
  baseURL: API_URL,
});

export const getVehicles = async () => {
  const response = await api.get('/vehicles');
  return response.data;
};

export const getVehicleById = async (id: string) => {
  const response = await api.get(`/vehicles/${id}`);
  return response.data;
};

export const createVehicle = async (vehicleData: any) => {
  const response = await api.post('/vehicles', vehicleData);
  return response.data;
};
