import React, { useState } from 'react';
import roomsService from '../../services/roomsService';

const Rooms = ({ onSubmit }) => {
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    roomType: '',
    capacity: '',
    totalRooms: '',
    availableRooms: '',
    pricing: '',
    facilities: [],
    features: {
      hasAttachedBathroom: false  ,
      numberOfBeds: 1
    }
  });

  const [facilityInput, setFacilityInput] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [name]: value
      }
    }));
  };

  const handleFacilityAdd = () => {
    if (facilityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        facilities: [...prev.facilities, facilityInput.trim()]
      }));
      setFacilityInput('');
    }
  };

  const removeFacility = (index) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title || !formData.subtitle || !formData.description || 
        !formData.roomType || !formData.capacity || !formData.totalRooms || 
        !formData.availableRooms || !formData.pricing || formData.facilities.length === 0) {
      setError('All fields are required');
      return;
    }

    try {
      // Convert numeric strings to numbers
      const roomData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        totalRooms: parseInt(formData.totalRooms),
        availableRooms: parseInt(formData.availableRooms),
        pricing: parseFloat(formData.pricing)
      };

      // Call the service to create room
      await roomsService.createRoomData(roomData);

      // Reset form after successful submission
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        roomType: '',
        capacity: '',
        totalRooms: '',
        availableRooms: '',
        pricing: '',
        facilities: [],
        features: {
          hasAttachedBathroom: false,
          numberOfBeds: 1
        }
      });

      // You might want to show a success message or redirect
      alert('Room created successfully!');
      
    } catch (err) {
      setError(err.message || 'Failed to create room');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add New Room</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}


      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            maxLength={100}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            maxLength={200}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 h-32"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Room Type</label>
          <select
            name="roomType"
            value={formData.roomType}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Room Type</option>
            <option value="master">Master</option>
            <option value="kids">Kids</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Capacity</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleInputChange}
            max={4}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Total Rooms</label>
          <input
            type="number"
            name="totalRooms"
            value={formData.totalRooms}
            onChange={handleInputChange}
            min={1}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Available Rooms</label>
          <input
            type="number"
            name="availableRooms"
            value={formData.availableRooms}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pricing</label>
          <input
            type="number"
            name="pricing"
            value={formData.pricing}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Facilities</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={facilityInput}
              onChange={(e) => setFacilityInput(e.target.value)}
              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Add facility"
            />
            <button
              type="button"
              onClick={handleFacilityAdd}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {formData.facilities.map((facility, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                <span>{facility}</span>
                <button
                  type="button"
                  onClick={() => removeFacility(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.features.hasAttachedBathroom}
              onChange={(e) => handleFeatureChange('hasAttachedBathroom', e.target.checked)}
              className="rounded"
            />
            <label className="text-sm">Has Attached Bathroom</label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Number of Beds</label>
            <input
              type="number"
              value={formData.features.numberOfBeds}
              onChange={(e) => handleFeatureChange('numberOfBeds', parseInt(e.target.value))}
              min={1}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
        >
          Create Room
        </button>
      </form>
    </div>
  );
};

export default Rooms;