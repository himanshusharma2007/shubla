import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import DatePicker from "react-datepicker";
import roomsService from "../../services/roomsService";

const RoomBookingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    checkIn: null,
    checkOut: null,
    quantity: 1,
    roomType: 'master',
    guests: 1
  });
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    validateForm();
  }, [formData, selectedRoom]);

  const fetchRooms = async () => {
    try {
      if (rooms.length <= 0) {
        const res = await roomsService.getRoomsData();
        setRooms(res.roomData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Date validation
    if (!formData.checkIn) {
      newErrors.checkIn = 'Check-in date is required';
    }
    if (!formData.checkOut) {
      newErrors.checkOut = 'Check-out date is required';
    }
    if (formData.checkIn && formData.checkOut && formData.checkIn >= formData.checkOut) {
      newErrors.checkOut = 'Check-out must be after check-in';
    }

    // Room quantity validation
    if (formData.quantity < 1) {
      newErrors.quantity = 'Minimum 1 room required';
    }
    if (formData.quantity > 4) {
      newErrors.quantity = 'Maximum 4 rooms allowed';
    }

    // Guest validation
    const minGuests = formData.quantity;
    const maxGuests = formData.quantity * selectedRoom?.capacity;

    if (formData.guests < minGuests) {
      newErrors.guests = `Minimum ${minGuests} guest${minGuests > 1 ? 's' : ''} required`;
    }
    if (formData.guests > maxGuests) {
      newErrors.guests = `Maximum ${maxGuests} guests allowed for ${formData.quantity} room${formData.quantity > 1 ? 's' : ''}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRoomTypeChange = (e) => {
    const newRoomType = e.target.value;
    setFormData(prev => ({ ...prev, roomType: newRoomType }));
    const newSelectedRoom = rooms.find(room => room?.roomType === newRoomType);
    if (newSelectedRoom) {
      setSelectedRoom(newSelectedRoom);
    }
  };

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const diffTime = formData.checkOut.getTime() - formData.checkIn.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = () => {
    const nights = calculateNights();
    return selectedRoom?.pricing * formData.quantity * nights;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...formData, amount: calculateTotalPrice() });
    }
  };

  return (
    <div className="space-y-6">

        {
          (selectedRoom !== null) &&
          <div className="bg-zinc-50 rounded-lg shadow p-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">{selectedRoom?.title}</h3>
              <p className="text-zinc-600">${selectedRoom?.pricing}/night</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-zinc-600">
              <div>Available: {selectedRoom?.availableRooms}/{selectedRoom?.totalRooms}</div>
              <div>Capacity: {selectedRoom?.capacity} guests/room</div>
              <div>Facilities: {selectedRoom?.facilities.join(', ')}</div>
              <div>Type: {selectedRoom?.roomType}</div>
            </div>
            {calculateNights() > 0 && (
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-medium">
                  <span>Total ({calculateNights()} nights, {formData.quantity} rooms)</span>
                  <span>${calculateTotalPrice()}</span>
                </div>
              </div>
            )}
          </div>
          </div>
        }

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in Date
            </label>
            <DatePicker
              selected={formData.checkIn}
              onChange={date => setFormData(prev => ({ ...prev, checkIn: date }))}
              className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.checkIn ? 'border-red-500' : 'border-gray-300'
                }`}
              minDate={new Date()}
              placeholderText="Select check-in date"
            />
            {errors.checkIn && <p className="mt-1 text-sm text-red-500">{errors.checkIn}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-out Date
            </label>
            <DatePicker
              selected={formData.checkOut}
              onChange={date => setFormData(prev => ({ ...prev, checkOut: date }))}
              className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.checkOut ? 'border-red-500' : 'border-gray-300'
                }`}
              minDate={formData.checkIn || new Date()}
              placeholderText="Select check-out date"
            />
            {errors.checkOut && <p className="mt-1 text-sm text-red-500">{errors.checkOut}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Type
            </label>
            <select
              value={formData.roomType}
              onChange={handleRoomTypeChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option selected >Select</option>
              {rooms?.map((e, i) => (
                <option key={i} value={e?.roomType} >{e?.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Rooms
            </label>
            <input
              type="number"
              min="1"
              max="4"
              value={formData.quantity}
              onChange={e => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
              className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.quantity ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Guests
            </label>
            <input
              type="number"
              min="1"
              value={formData.guests}
              onChange={e => setFormData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
              className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.guests ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.guests && <p className="mt-1 text-sm text-red-500">{errors.guests}</p>}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-zinc-600 text-white py-3 px-6 rounded-md hover:bg-zinc-700 transition-colors flex items-center justify-center"
        >
          Book Room
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </form>
    </div>
  );
};

export default RoomBookingForm;