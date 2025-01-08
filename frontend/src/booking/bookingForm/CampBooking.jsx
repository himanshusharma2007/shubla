import React, { useEffect, useState } from "react";
import { Calendar, ChevronRight, Tent, Users } from "lucide-react";
import DatePicker from "react-datepicker";
import campService from "../../services/campsService";

const CampBookingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    checkIn: null,
    checkOut: null,
    quantity: 1,
    guests: 1,
  });
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCamp();
  }, []);

  const fetchCamp = async () => {
    try {
      const res = await campService.getCampsData();
      console.log('res', res)
      setSelectedCamp(res.campData); // Select first camp as default
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

    // Tent quantity validation
    if (formData.quantity < 1) {
      newErrors.quantity = "Minimum 1 tent required";
    }
    if (formData.quantity > 4) {
      newErrors.quantity = "Maximum 4 tents allowed";
    }

    // Guest validation
    if (formData.guests < 1) {
      newErrors.guests = "Minimum 1 guest required";
    }
    if (formData.guests > 16) {
      newErrors.guests = "Maximum 16 guests allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const diffTime = formData.checkOut.getTime() - formData.checkIn.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = () => {
    const nights = calculateNights();
    return selectedCamp?.pricing * formData.quantity * nights;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...formData, amount: calculateTotalPrice() });
    }
  };

  return (
    <div className="space-y-6">
      {/* Price Information Card */}
      {selectedCamp && (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">{selectedCamp.title}</h3>
              <p className="text-zinc-600">${selectedCamp.pricing}/night</p>
            </div>
            <div className="flex justify-between text-sm text-zinc-600">
              <div>
                Available: {selectedCamp.availableCamps}/
                {selectedCamp.totalCamps}
              </div>
              <div>Max Guests: 16 per tent</div>
              
            </div>
            {calculateNights() > 0 && (
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-medium">
                  <span>
                    Total ({calculateNights()} nights, {formData.quantity}{" "}
                    tents)
                  </span>
                  <span>${calculateTotalPrice()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

<form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Check-in Date */}
        <div className="relative">
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Check-in Date
          </label>
          <input
            type="date"
            value={formData.checkIn ? formData.checkIn.toISOString().split('T')[0] : ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              checkIn: new Date(e.target.value)
            }))}
            className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200
              ${errors.checkIn
                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-zinc-200 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 hover:border-zinc-300'}`}
            min={new Date().toISOString().split('T')[0]}
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
            value={formData.checkOut ? formData.checkOut.toISOString().split('T')[0] : ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              checkOut: new Date(e.target.value)
            }))}
            className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200
              ${errors.checkOut
                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-zinc-200 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 hover:border-zinc-300'}`}
            min={formData.checkIn ? formData.checkIn.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
          />
          {errors.checkOut && (
            <p className="mt-1.5 text-sm text-red-500">{errors.checkOut}</p>
          )}
        </div>

        {/* Number of Tents */}
        <div className="relative">
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Number of Tents
          </label>
          <input
            type="number"
            min="1"
            max="4"
            value={formData.quantity}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              quantity: parseInt(e.target.value)
            }))}
            className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200
              ${errors.quantity
                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-zinc-200 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 hover:border-zinc-300'}`}
          />
          {errors.quantity && (
            <p className="mt-1.5 text-sm text-red-500">{errors.quantity}</p>
          )}
        </div>

        {/* Number of Guests */}
        <div className="relative">
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Number of Guests
          </label>
          <input
            type="number"
            min="1"
            value={formData.guests}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              guests: parseInt(e.target.value)
            }))}
            className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200
              ${errors.guests
                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-zinc-200 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 hover:border-zinc-300'}`}
          />
          {errors.guests && (
            <p className="mt-1.5 text-sm text-red-500">{errors.guests}</p>
          )}
        </div>

      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-zinc-600 text-white py-4 px-6 rounded-lg hover:bg-zinc-700 
          active:bg-zinc-800 transition-all duration-200 flex items-center justify-center
          focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
      >
        <span className="text-base font-medium">Book Camp</span>
        <ChevronRight className="w-5 h-5 ml-2" />
      </button>
    </form>
    </div>
  );
};

export default CampBookingForm;