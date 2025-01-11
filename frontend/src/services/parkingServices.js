import api from './api';

// Fetch all parking data
export const getParkingData = async () => {
    try {
        const response = await api.get('/parking/');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch parking data';
    }
};

// Create a new parking slot
export const createParkingSlot = async (parkingDetails) => {
    try {
        const response = await api.post('/parking/create', parkingDetails);
        return response.data;
    } catch (error) {
        console.log(error)
        throw error.response?.data?.message || 'Failed to create parking slot';
    }
};

// Update an existing parking slot
export const updateParkingSlot = async (id, parkingDetails) => {
    try {
        const response = await api.put(`/parking/update/${id}`, parkingDetails);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to update parking slot';
    }
};
