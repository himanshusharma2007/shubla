import { ChevronRight } from "lucide-react";
import DatePicker from "react-datepicker";

const ParkingBookingForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
      checkIn: null,
      checkOut: null,
      quantity: 1
    });
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in Date
            </label>
            <DatePicker
              selected={formData.checkIn}
              onChange={date => setFormData(prev => ({ ...prev, checkIn: date }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              minDate={new Date()}
              placeholderText="Select check-in date"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-out Date
            </label>
            <DatePicker
              selected={formData.checkOut}
              onChange={date => setFormData(prev => ({ ...prev, checkOut: date }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              minDate={formData.checkIn || new Date()}
              placeholderText="Select check-out date"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Parking Slots
            </label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={e => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
  
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          Book Parking
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </form>
    );
  };

export default ParkingBookingForm;