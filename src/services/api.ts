import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID'; // Replace with your actual key

export const api = axios.create({
  baseURL: API_URL,
});

// Vehicle APIs
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

export const updateVehicle = async (id: string, vehicleData: any) => {
  const response = await api.put(`/vehicles/${id}`, vehicleData);
  return response.data;
};

export const deleteVehicle = async (id: string) => {
  const response = await api.delete(`/vehicles/${id}`);
  return response.data;
};

// Fine APIs
export const getFines = async () => {
  const response = await api.get('/fines');
  return response.data;
};

export const getFineById = async (id: string) => {
  const response = await api.get(`/fines/${id}`);
  return response.data;
};

export const getFinesByVehicle = async (vehicleId: string) => {
  const response = await api.get(`/fines/vehicle/${vehicleId}`);
  return response.data;
};

export const createFine = async (fineData: any) => {
  const response = await api.post('/fines', fineData);
  return response.data;
};

export const updateFine = async (id: string, fineData: any) => {
  const response = await api.put(`/fines/${id}`, fineData);
  return response.data;
};

export const deleteFine = async (id: string) => {
  const response = await api.delete(`/fines/${id}`);
  return response.data;
};

// Payment APIs
export const createPaymentOrder = async (fineId: string) => {
  const response = await api.post(`/payments/create-order`, { fineId });
  return response.data;
};

export const verifyPayment = async (paymentData: any) => {
  const response = await api.post(`/payments/verify`, paymentData);
  return response.data;
};

export const getRazorpayKey = () => RAZORPAY_KEY_ID;
