import React, { useState, useEffect } from 'react';
import roomsService from '../../services/roomsService';

const Rooms = () => {
  const [rooms, setRooms] = useState({ master: null, kids: null });
  const [isEditing, setIsEditing] = useState({ master: false, kids: false });
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    capacity: '',
    totalRooms: '',
    availableRooms: '',
    pricing: '',
    facilities: [],
    roomType: '',
    features: {
      hasAttachedBathroom: false,
      numberOfBeds: 1
    }
  });
  
  const [facilityInput, setFacilityInput] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomsService.getRoomsData();
      const roomsData = response.roomData;
      console.log('response.roomData', response)
      
      if (Array.isArray(roomsData)) {
        // If roomsData is an array, find master and kids rooms
        setRooms({
          master: roomsData.find(room => room.roomType === 'master') || null,
          kids: roomsData.find(room => room.roomType === 'kids') || null
        });
      } else if (roomsData) {
        // If it's a single object, keep current logic
        setRooms({
          master: roomsData.roomType === 'master' ? roomsData : null,
          kids: roomsData.roomType === 'kids' ? roomsData : null
        });
      }
    } catch (err) {
      setError('Failed to fetch rooms data');
    }
  };

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

  const initializeForm = (roomType) => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      roomType,
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
    setIsEditing({ ...isEditing, [roomType]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const roomData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        totalRooms: parseInt(formData.totalRooms),
        availableRooms: parseInt(formData.availableRooms),
        pricing: parseFloat(formData.pricing)
      };

      const response = await roomsService.createRoomData(roomData);
      await fetchRooms();
      setIsEditing({ master: false, kids: false });
      alert('Room data saved successfully!');
    } catch (err) {
      setError(err.message || 'Failed to save room');
      alert('Error: Failed to save room');
    }
  };
  const handleUpdate = async (roomType) => {
    if (!rooms[roomType]?._id) return;
    
    try {
      const response = await roomsService.updateRoomData(rooms[roomType]._id, formData);
      await fetchRooms();
      setIsEditing({ ...isEditing, [roomType]: false });
    } catch (err) {
      setError(err.message || 'Failed to update room');
    }
  };

  const RoomForm = () => (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              max={4}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
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
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Available Rooms</label>
            <input
              type="number"
              name="availableRooms"
              value={formData.availableRooms}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Pricing (₹)</label>
            <input
              type="number"
              name="pricing"
              value={formData.pricing}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Room Features</h4>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hasAttachedBathroom"
              checked={formData.features.hasAttachedBathroom}
              onChange={(e) => handleFeatureChange('hasAttachedBathroom', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="hasAttachedBathroom">Has Attached Bathroom</label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Number of Beds</label>
            <input
              type="number"
              value={formData.features.numberOfBeds}
              onChange={(e) => handleFeatureChange('numberOfBeds', parseInt(e.target.value))}
              min={1}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Facilities</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={facilityInput}
              onChange={(e) => setFacilityInput(e.target.value)}
              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add facility"
            />
            <button
              type="button"
              onClick={handleFacilityAdd}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {formData.facilities.map((facility, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
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

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsEditing({ master: false, kids: false })}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );

  const RoomDisplay = ({ room, type }) => {
    const isKidsRoom = type === 'kids';
    
    return (
      <div className={`border rounded-lg shadow-sm mb-6 overflow-hidden ${
        isKidsRoom ? 'border-purple-200' : 'border-blue-200'
      }`}>
        <div className={`p-4 ${isKidsRoom ? 'bg-purple-50' : 'bg-blue-50'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-2xl font-bold ${
              isKidsRoom ? 'text-purple-600' : 'text-blue-600'
            }`}>
              {isKidsRoom ? '🧒 Kids Room' : '👨‍👩‍👦 Master Room'}
            </h3>
            <button
              onClick={() => {
                setFormData(room);
                setIsEditing({ ...isEditing, [type]: true });
              }}
              className={`px-4 py-2 rounded text-white ${
                isKidsRoom ? 'bg-purple-500 hover:bg-purple-600' : 'bg-blue-500 hover:bg-blue-600'
              } focus:ring-2 focus:ring-offset-2 ${
                isKidsRoom ? 'focus:ring-purple-500' : 'focus:ring-blue-500'
              }`}
            >
              Edit Room Details
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Title:</span>
                <span>{room.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Subtitle:</span>
                <span>{room.subtitle}</span>
              </div>
              <div>
                <span className="font-semibold">Description:</span>
                <p className="mt-1 text-gray-600">{room.description}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Capacity:</span>
                <span>{room.capacity} persons</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Available/Total:</span>
                <span>{room.availableRooms}/{room.totalRooms} rooms</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Price:</span>
                <span>₹{room.pricing}/night</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold mb-2">Room Features:</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <span>🚿 Attached Bathroom:</span>
                <span>{room.features?.hasAttachedBathroom ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🛏️ Number of Beds:</span>
                <span>{room.features?.numberOfBeds}</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold mb-2">Facilities:</h4>
            <div className="flex flex-wrap gap-2">
              {room.facilities.map((facility, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm ${
                    isKidsRoom
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {facility}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Room Management</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
        {!rooms.master && !isEditing.master ? (
          <button
            onClick={() => initializeForm('master')}
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Master Room
          </button>
        ) : isEditing.master ? (
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="text-xl font-bold text-blue-600 mb-4">Edit Master Room</h3>
            <RoomForm />
          </div>
        ) : (
          <RoomDisplay room={rooms.master} type="master" />
        )}
        </div>

        <div>
        {!rooms.kids && !isEditing.kids ? (
          <button
            onClick={() => initializeForm('kids')}
            className="bg-purple-500 text-white px-6 py-3 rounded hover:bg-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Add Kids Room
          </button>
        ) : isEditing.kids ? (
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="text-xl font-bold text-purple-600 mb-4">Edit Kids Room</h3>
            <RoomForm />
          </div>
        ) : rooms.kids && (
          <RoomDisplay room={rooms.kids} type="kids" />
        )}
        </div>
      </div>

      {/* Success Message Toast */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        {/* Show success messages here */}
      </div>
    </div>
  );
};

export default Rooms;