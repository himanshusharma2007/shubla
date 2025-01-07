import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import DatePicker from "react-datepicker";
import roomsService from "../../services/roomsService";

const RoomBookingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    checkIn: null,
    checkOut: null,
    quantity: 1,
    roomType: "master",
    guests: 1,
  });
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchRooms();
  }, []);
  useEffect(() => {
    if (rooms.length > 0) {
      const masterRoom = rooms.find(room => room.roomType === "master");
      if (masterRoom) {
        setSelectedRoom(masterRoom);
      }
    }
  }, [rooms]);

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
      newErrors.checkIn = "Check-in date is required";
    }
    if (!formData.checkOut) {
      newErrors.checkOut = "Check-out date is required";
    }
    if (
      formData.checkIn &&
      formData.checkOut &&
      formData.checkIn >= formData.checkOut
    ) {
      newErrors.checkOut = "Check-out must be after check-in";
    }

    // Room quantity validation
    if (formData.quantity < 1) {
      newErrors.quantity = "Minimum 1 room required";
    }
    if (formData.quantity > 4) {
      newErrors.quantity = "Maximum 4 rooms allowed";
    }

    // Guest validation
    const minGuests = formData.quantity;
    const maxGuests = formData.quantity * selectedRoom?.capacity;

    if (formData.guests < minGuests) {
      newErrors.guests = `Minimum ${minGuests} guest${
        minGuests > 1 ? "s" : ""
      } required`;
    }
    if (formData.guests > maxGuests) {
      newErrors.guests = `Maximum ${maxGuests} guests allowed for ${
        formData.quantity
      } room${formData.quantity > 1 ? "s" : ""}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRoomTypeChange = (e) => {
   
    const newRoomType =  e.target?.value 
    console.log('newRoomType', newRoomType)
    setFormData((prev) => ({ ...prev, roomType: newRoomType }));
    const newSelectedRoom = rooms.find(
      (room) => room?.roomType === newRoomType
    );
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
       {selectedRoom  && (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">{selectedRoom?.title}</h3>
              <p className="text-zinc-600">${selectedRoom?.pricing}/night</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-zinc-600">
              <div>
                Available: {selectedRoom?.availableRooms}/
                {selectedRoom?.totalRooms}
              </div>
              <div>Capacity: {selectedRoom?.capacity} guests/room</div>
              <div>Facilities: {selectedRoom?.facilities.join(", ")}</div>
              <div>Type: {selectedRoom?.roomType}</div>
            </div>
            {calculateNights() > 0 && (
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-medium">
                  <span>
                    Total ({calculateNights()} nights, {formData.quantity}{" "}
                    rooms)
                  </span>
                  <span>${calculateTotalPrice()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 space-y-8"
      >
        {/* Grid Layout for Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Check-in Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Check-in Date
            </label>
            <input
              type="date"
              value={
                formData.checkIn
                  ? formData.checkIn.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  checkIn: new Date(e.target.value),
                }))
              }
              className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200
                ${
                  errors.checkIn
                    ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-zinc-200 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 hover:border-zinc-300"
                }`}
              min={new Date().toISOString().split("T")[0]}
            />
            {errors.checkIn && (
              <p className="mt-1.5 text-sm text-red-500">{errors.checkIn}</p>
            )}
          </div>

          {/* Check-out Date */}
          <div className="relative">
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Check-out Date
            </label>
            <input
              type="date"
              value={
                formData.checkOut
                  ? formData.checkOut.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  checkOut: new Date(e.target.value),
                }))
              }
              className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200
                ${
                  errors.checkOut
                    ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-zinc-200 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 hover:border-zinc-300"
                }`}
              min={
                formData.checkIn
                  ? formData.checkIn.toISOString().split("T")[0]
                  : new Date().toISOString().split("T")[0]
              }
            />
            {errors.checkOut && (
              <p className="mt-1.5 text-sm text-red-500">{errors.checkOut}</p>
            )}
          </div>

          {/* Number of Rooms */}
          <div className="relative">
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Number of Rooms
            </label>
            <input
              type="number"
              min="1"
              max="4"
              value={formData.quantity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  quantity: parseInt(e.target.value),
                }))
              }
              className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200
                ${
                  errors.quantity
                    ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-zinc-200 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 hover:border-zinc-300"
                }`}
            />
            {errors.quantity && (
              <p className="mt-1.5 text-sm text-red-500">{errors.quantity}</p>
            )}
          </div>

          {/* Number of Guests */}
          <div className="relative ">
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Number of Guests
            </label>
            <input
              type="number"
              min="1"
              value={formData.guests}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  guests: parseInt(e.target.value),
                }))
              }
              className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200
                ${
                  errors.guests
                    ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-zinc-200 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 hover:border-zinc-300"
                }`}
            />
            {errors.guests && (
              <p className="mt-1.5 text-sm text-red-500">{errors.guests}</p>
            )}
          </div>
          {/* Room Type */}
          <div className="relative md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Room Type
            </label>
            <div className="relative">
              <select
                value={formData.roomType}
                onChange={handleRoomTypeChange}
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg appearance-none bg-white
                  focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 hover:border-zinc-300 
                  transition-all duration-200 pr-10"
              >
                {rooms?.map((room, index) => (
                  <option key={index} value={room?.roomType}>
                    {room?.title}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-zinc-600 text-white py-4 px-6 rounded-lg hover:bg-zinc-700 
            active:bg-zinc-800 transition-all duration-200 flex items-center justify-center
            focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
        >
          <span className="text-base font-medium">Book Room</span>
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </form>
    </div>
  );
};

export default RoomBookingForm;
