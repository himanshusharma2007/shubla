// PackageBookingForm.jsx
import React, { useEffect, useState } from "react";
import { ChevronRight, Home, Tent, Car, Package, Users, CalendarDays, AlertCircle } from "lucide-react";
import roomsService from "../../services/roomsService";

const PackageBookingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    checkIn: null,
    checkOut: null,
    services: {
      room: {
        master: {
          quantity: 0,
          guests: 0
        },
        kids: {
          quantity: 0,
          guests: 0
        }
      },
      camp: {
        quantity: 0,
        guests: 0
      },
      parking: {
        quantity: 0
      }
    },
    paymentStatus: "pending"
  });

  const [rooms, setRooms] = useState([]);
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState('dates'); // For accordion-style sections

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await roomsService.getRoomsData();
      setRooms(res.roomData);
    } catch (error) {
      console.log(error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.checkIn) {
      newErrors.checkIn = "Check-in date is required";
    }
    if (!formData.checkOut) {
      newErrors.checkOut = "Check-out date is required";
    }
    if (formData.checkIn && formData.checkOut && formData.checkIn >= formData.checkOut) {
      newErrors.checkOut = "Check-out must be after check-in";
    }

    const hasService = 
      formData.services.room.master.quantity > 0 ||
      formData.services.room.kids.quantity > 0 ||
      formData.services.camp.quantity > 0 ||
      formData.services.parking.quantity > 0;

    if (!hasService) {
      newErrors.services = "Please select at least one service";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    } else {
      // Show error summary
      setActiveSection('error');
    }
  };

  const handleServiceChange = (service, type, field, value) => {
    const numValue = parseInt(value) || 0;
    if (numValue < 0) return; // Prevent negative values

    setFormData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: type ? {
          ...prev.services[service],
          [type]: {
            ...prev.services[service][type],
            [field]: numValue
          }
        } : {
          ...prev.services[service],
          [field]: numValue
        }
      }
    }));
  };

  const ServiceCard = ({ title, icon: Icon, children, isActive, onClick }) => (
    <div 
      className={`bg-white rounded-lg shadow-sm border transition-all duration-300 overflow-hidden
        ${isActive ? 'border-zinc-500' : 'border-zinc-200'}`}
    >
      <div 
        className={`p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-50
          ${isActive ? 'bg-zinc-50' : ''}`}
        onClick={onClick}
      >
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5 text-zinc-600" />
          <h3 className="font-medium text-zinc-800">{title}</h3>
        </div>
        <svg
          className={`w-5 h-5 text-zinc-400 transform transition-transform duration-200 
            ${isActive ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isActive && (
        <div className="p-4 border-t border-zinc-100">
          {children}
        </div>
      )}
    </div>
  );

  const QuantityInput = ({ label, value, onChange, max }) => (
    <div className="flex items-center space-x-4">
      <label className="text-sm text-zinc-600 flex-grow">{label}</label>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-8 h-8 flex items-center justify-center rounded border border-zinc-200 
            hover:bg-zinc-50 active:bg-zinc-100 transition-colors"
        >
          -
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.min(max || 99, Math.max(0, parseInt(e.target.value) || 0)))}
          className="w-16 text-center px-2 py-1 border border-zinc-200 rounded"
        />
        <button
          type="button"
          onClick={() => onChange(Math.min(max || 99, value + 1))}
          className="w-8 h-8 flex items-center justify-center rounded border border-zinc-200 
            hover:bg-zinc-50 active:bg-zinc-100 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const diffTime = formData.checkOut.getTime() - formData.checkIn.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">
            <p className="font-medium mb-1">Please correct the following errors:</p>
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(errors).map(([key, value]) => (
                <li key={key}>{value}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dates Section */}
        <ServiceCard 
          title="Select Dates" 
          icon={CalendarDays}
          isActive={activeSection === 'dates'}
          onClick={() => setActiveSection('dates')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Check-in Date
              </label>
              <input
                type="date"
                value={formData.checkIn ? formData.checkIn.toISOString().split("T")[0] : ""}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  checkIn: new Date(e.target.value)
                }))}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200
                  ${errors.checkIn ? "border-red-300 bg-red-50" : "border-zinc-200 focus:border-zinc-500"}`}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Check-out Date
              </label>
              <input
                type="date"
                value={formData.checkOut ? formData.checkOut.toISOString().split("T")[0] : ""}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  checkOut: new Date(e.target.value)
                }))}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all duration-200
                  ${errors.checkOut ? "border-red-300 bg-red-50" : "border-zinc-200 focus:border-zinc-500"}`}
                min={formData.checkIn ? formData.checkIn.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
          {calculateNights() > 0 && (
            <p className="mt-4 text-sm text-zinc-600">
              Duration: {calculateNights()} night{calculateNights() !== 1 ? 's' : ''}
            </p>
          )}
        </ServiceCard>

        {/* Master Room Section */}
        <ServiceCard 
          title="Master Room" 
          icon={Home}
          isActive={activeSection === 'master'}
          onClick={() => setActiveSection('master')}
        >
          <div className="space-y-4">
            <QuantityInput
              label="Number of Rooms"
              value={formData.services.room.master.quantity}
              onChange={(value) => handleServiceChange('room', 'master', 'quantity', value)}
              max={4}
            />
            <QuantityInput
              label="Number of Guests"
              value={formData.services.room.master.guests}
              onChange={(value) => handleServiceChange('room', 'master', 'guests', value)}
              max={formData.services.room.master.quantity * 2}
            />
          </div>
        </ServiceCard>

        {/* Kids Room Section */}
        <ServiceCard 
          title="Kids Room" 
          icon={Home}
          isActive={activeSection === 'kids'}
          onClick={() => setActiveSection('kids')}
        >
          <div className="space-y-4">
            <QuantityInput
              label="Number of Rooms"
              value={formData.services.room.kids.quantity}
              onChange={(value) => handleServiceChange('room', 'kids', 'quantity', value)}
              max={4}
            />
            <QuantityInput
              label="Number of Guests"
              value={formData.services.room.kids.guests}
              onChange={(value) => handleServiceChange('room', 'kids', 'guests', value)}
              max={formData.services.room.kids.quantity * 2}
            />
          </div>
        </ServiceCard>

        {/* Camp Section */}
        <ServiceCard 
          title="Camp" 
          icon={Tent}
          isActive={activeSection === 'camp'}
          onClick={() => setActiveSection('camp')}
        >
          <div className="space-y-4">
            <QuantityInput
              label="Number of Camps"
              value={formData.services.camp.quantity}
              onChange={(value) => handleServiceChange('camp', null, 'quantity', value)}
              max={4}
            />
            <QuantityInput
              label="Number of Guests"
              value={formData.services.camp.guests}
              onChange={(value) => handleServiceChange('camp', null, 'guests', value)}
              max={formData.services.camp.quantity * 4}
            />
          </div>
        </ServiceCard>

        {/* Parking Section */}
        <ServiceCard 
          title="Parking" 
          icon={Car}
          isActive={activeSection === 'parking'}
          onClick={() => setActiveSection('parking')}
        >
          <QuantityInput
            label="Number of Parking Slots"
            value={formData.services.parking.quantity}
            onChange={(value) => handleServiceChange('parking', null, 'quantity', value)}
            max={4}
          />
        </ServiceCard>

        <button
          type="submit"
          className="w-full bg-zinc-600 text-white py-4 px-6 rounded-lg hover:bg-zinc-700 
            active:bg-zinc-800 transition-all duration-200 flex items-center justify-center
            focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
        >
          <span className="text-base font-medium">Book Package</span>
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </form>
    </div>
  );
};

export default PackageBookingForm;