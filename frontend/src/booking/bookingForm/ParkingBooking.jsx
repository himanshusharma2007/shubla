import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import DatePicker from "react-datepicker";
import { getParkingData } from "../../services/parkingServices";

const ParkingBookingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    checkIn: null,
    checkOut: null,
    quantity: 1,
  });
  const [parkingData, setParkingData] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchParkingData();
  }, []);

  const fetchParkingData = async () => {
    try {
      const res = await getParkingData();
      setParkingData(res.parkingData);
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

    // Quantity validation
    if (formData.quantity < 1) {
      newErrors.quantity = "Minimum 1 parking slot required";
    }
    if (formData.quantity > parkingData?.availableSlots) {
      newErrors.quantity = `Maximum ${parkingData?.availableSlots} slots available`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const calculateDays = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
  
    // Convert strings to Date objects
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
  
    // Ensure the conversion was successful
    if (isNaN(checkInDate) || isNaN(checkOutDate)) return 0;
  
    console.log('formData', formData);
  
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const calculateTotalPrice = () => {
    const checkInDay = new Date(formData.checkIn).getDay();
    const price =
      checkInDay === 0 || checkInDay === 6
        ? parkingData?.pricing?.weekend
        : parkingData?.pricing?.weekday;

    return price*calculateDays()
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...formData, amount: calculateTotalPrice() });
    }
  };

  return (
    <div className="space-y-6">
      {parkingData && (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">{parkingData.title}</h3>
              <p className="text-zinc-600">${parkingData?.pricing?.weekday}/day</p>
              <p className="text-zinc-600">weekend ${parkingData?.pricing?.weekend}/day</p>
            </div>
            <div className="flex justify-between text-sm text-zinc-600">
              <div>Featured: {parkingData.subtitle}</div>
              <div>
                Available: {parkingData.availableSlots}/{parkingData.totalSlots}
              </div>
            </div>
            <div className="col-span-2">
              Facilities: {parkingData.facilities.join(", ")}
            </div>
            {calculateDays() > 0 && (
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-medium">
                  <span>
                    Total ({calculateDays()} days, {formData.quantity} slots)
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Check-in Date
            </label>
            <input
              type="date"
              value={
                formData.checkIn
                  ? new Date(formData.checkIn).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, checkIn: e.target.value }))
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

          <div className="relative">
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Check-out Date
            </label>
            <input
              type="date"
              value={
                formData.checkOut
                  ? new Date(formData.checkOut).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, checkOut: e.target.value }))
              }
              className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200
                ${
                  errors.checkOut
                    ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-zinc-200 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 hover:border-zinc-300"
                }`}
              min={formData.checkIn || new Date().toISOString().split("T")[0]}
            />
            {errors.checkOut && (
              <p className="mt-1.5 text-sm text-red-500">{errors.checkOut}</p>
            )}
          </div>

          <div className="relative md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Number of Parking Slots
            </label>
            <input
              type="number"
              min="1"
              max={parkingData?.availableSlots || 1}
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
        </div>

        <button
          type="submit"
          className="w-full bg-zinc-600 text-white py-4 px-6 rounded-lg hover:bg-zinc-700 
            active:bg-zinc-800 transition-all duration-200 flex items-center justify-center
            focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
        >
          <span className="text-base font-medium">Book Parking</span>
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </form>
    </div>
  );
};

export default ParkingBookingForm;
