import React, { useState, useEffect } from 'react';
import { getParkingData, createParkingSlot, updateParkingSlot } from '../../services/parkingServices';
import { Save, Plus, Edit2, Check, X, CircleParking } from 'lucide-react';

const ParkingManagement = () => {
  const [parkingData, setParkingData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    facilities: [''], // Default facility array
    description: '',
    totalSlots: '',
    availableSlots: '',
    dimension: {
        width: 10,
        length: 10,
    },
    pricing: {
        weekday: '',
        weekend: '',
    },
    amenities: {
        electricity: true,
        water: true,
        sanitation: true,
    },
});

useEffect(() => {
    fetchParkingData();
}, []);

const fetchParkingData = async () => {
    try {
        const response = await getParkingData();
        if (response.success) {
            setParkingData(response.parkingData);
            if (response.parkingData) {
                setFormData({
                    ...response.parkingData,
                    pricing: response.parkingData.pricing || { weekday: '', weekend: '' },
                    dimension: response.parkingData.dimension || { width: 10, length: 10 },
                });
            }
        }
    } catch (err) {
        setError('Failed to fetch parking data');
    }
};

const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));
};

const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
        ...prev,
        dimension: {
            ...prev.dimension,
            [name]: Number(value), // Ensure numeric type
        },
    }));
};

const handlePricingChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
        ...prev,
        pricing: {
            ...prev.pricing,
            [name]: Number(value), // Ensure numeric type
        },
    }));
};

const handleAmenityChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
        ...prev,
        amenities: {
            ...prev.amenities,
            [name]: checked,
        },
    }));
};

const handleFacilityChange = (index, value) => {
    setFormData((prev) => {
        const updatedFacilities = [...prev.facilities];
        updatedFacilities[index] = value;
        return { ...prev, facilities: updatedFacilities };
    });
};

const addFacility = () => {
    setFormData((prev) => ({
        ...prev,
        facilities: [...prev.facilities, ''],
    }));
};

const removeFacility = (index) => {
    setFormData((prev) => {
        const updatedFacilities = prev.facilities.filter((_, i) => i !== index);
        return { ...prev, facilities: updatedFacilities };
    });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        if (parkingData && isEditing) {
            await updateParkingSlot(parkingData._id, formData);
        } else {
            await createParkingSlot(formData);
        }
        await fetchParkingData();
        setIsEditing(false);
    } catch (err) {
        setError(err.message || 'An error occurred');
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <CircleParking className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-800">
              Parking Slot Management
            </h1>
          </div>
          {parkingData && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Details
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
            <X className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={!isEditing && parkingData}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={!isEditing && parkingData}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              required
              disabled={!isEditing && parkingData}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facilities
            </label>
            <div className="space-y-2">
              {formData.facilities.map((facility, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={facility}
                    onChange={(e) => handleFacilityChange(index, e.target.value)}
                    className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={!isEditing && parkingData}
                  />
                  {(isEditing || !parkingData) && (
                    <button
                      type="button"
                      onClick={() => removeFacility(index)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              {(isEditing || !parkingData) && (
                <button
                  type="button"
                  onClick={addFacility}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Facility
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Slots
              </label>
              <input
                type="number"
                name="totalSlots"
                value={formData.totalSlots}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                required
                disabled={!isEditing && parkingData}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Slots
              </label>
              <input
                type="number"
                name="availableSlots"
                value={formData.availableSlots}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max={formData.totalSlots}
                required
                disabled={!isEditing && parkingData}
              />
            </div>
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pricing
            </label>
            <input
              type="number"
              name="pricing"
              value={formData.pricing}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
              required
              disabled={!isEditing && parkingData}
            />
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dimension (Width x Length)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width (m)
                </label>
                <input
                type="number"
                name="width"
                value={formData.dimension.width}
                onChange={handleDimensionChange}
                required
                className="input-class"
              />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Length (m)
                </label>
                <input
                type="number"
                name="length"
                value={formData.dimension.length}
                onChange={handleDimensionChange}
                required
                className="input-class"
              />
              </div>
            </div>
          </div>
          <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
        Pricing
    </label>
    <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Weekday Price
            </label>
            <input
              type="number"
              name="weekday"
              value={formData.pricing.weekday}
              onChange={handlePricingChange}
              required
              className="input-class"
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Weekend Price
            </label>
            <input
              type="number"
              name="weekend"
              value={formData.pricing.weekend}
              onChange={handlePricingChange}
              required
              className="input-class"
            />
        </div>
    </div>
</div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amenities
            </label>
            <div className="space-y-2">
              {['electricity', 'water', 'sanitation'].map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={amenity}
                    checked={formData.amenities[amenity]}
                    onChange={handleAmenityChange}
                    disabled={!isEditing && parkingData}
                  />
                  <label className="text-sm">{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</label>
                </div>
              ))}
            </div>
          </div>

          {(!parkingData || isEditing) && (
            <div className="flex justify-end space-x-4">
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    fetchParkingData();
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {parkingData ? 'Update' : 'Create'} Parking Slot
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ParkingManagement;
