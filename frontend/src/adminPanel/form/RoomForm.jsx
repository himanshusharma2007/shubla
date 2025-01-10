import React from "react";
import {
  Bed,
  Users,
  DollarSign,
  Calendar,
  Bath,
  Edit2,
  Check,
  X,
} from "lucide-react";

export const RoomForm = ({
  type,
  formData,
  handleInputChange,
  handleFeatureChange,
  handleSubmit,
  facilityInput,
  setFacilityInput,
  handleFacilityAdd,
  removeFacility,
  setIsEditing,
  isEditing,
}) => {
  console.log("isEditing[type]", isEditing[type]);
  const isKidsRoom = type === "kids";

  return (
    <form
      // In RoomForm.jsx
      onSubmit={(e) =>
        isEditing[type] ? handleSubmit(e, type) : handleSubmit(e)
      }
      className="bg-white rounded-lg shadow-lg p-6 space-y-6"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter room title"
              required
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter subtitle"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              placeholder="Enter room description"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Users className="inline w-4 h-4 mr-1" />
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="1"
                max="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Bed className="inline w-4 h-4 mr-1" />
                Total Rooms
              </label>
              <input
                type="number"
                name="totalRooms"
                value={formData.totalRooms}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline w-4 h-4 mr-1" />
                Available Rooms
              </label>
              <input
                type="number"
                name="availableRooms"
                value={formData.availableRooms}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="inline w-4 h-4 mr-1" />
                Price per Night
              </label>
              <input
                type="number"
                name="pricing"
                value={formData.pricing}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Room Features</h4>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasAttachedBathroom"
                checked={formData.features?.hasAttachedBathroom}
                onChange={(e) =>
                  handleFeatureChange("hasAttachedBathroom", e.target.checked)
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="hasAttachedBathroom"
                className="text-sm text-gray-700"
              >
                <Bath className="inline w-4 h-4 mr-1" />
                Attached Bathroom
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Bed className="inline w-4 h-4 mr-1" />
                Number of Beds
              </label>
              <input
                type="number"
                value={formData.features?.numberOfBeds}
                onChange={(e) =>
                  handleFeatureChange("numberOfBeds", parseInt(e.target.value))
                }
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Facilities
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={facilityInput}
            onChange={(e) => setFacilityInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Add facility (e.g., WiFi, TV, Mini Bar)"
          />
          <button
            type="button"
            onClick={handleFacilityAdd}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.facilities.map((facility, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                isKidsRoom
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {facility}
              <button
                type="button"
                onClick={() => removeFacility(index)}
                className="ml-1 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className={`flex-1 py-2 px-4 rounded-lg text-white transition-all ${
            isKidsRoom
              ? "bg-purple-500 hover:bg-purple-600 focus:ring-purple-500"
              : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
          } focus:ring-2 focus:ring-offset-2`}
        >
          <Check className="inline w-4 h-4 mr-2" />
          Save Changes
        </button>
        <button
          type="button"
          onClick={() => setIsEditing({ master: false, kids: false })}
          className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
        >
          <X className="inline w-4 h-4 mr-2" />
          Cancel
        </button>
      </div>
    </form>
  );
};

export const RoomDisplay = ({ room, type, setIsEditing }) => {
  const isKidsRoom = type === "kids";

  return (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all ${
        isKidsRoom ? "hover:shadow-purple-100" : "hover:shadow-blue-100"
      }`}
    >
      <div className={`p-6 ${isKidsRoom ? "bg-purple-50" : "bg-blue-50"}`}>
        <div className="flex justify-between items-center mb-6">
          <h3
            className={`text-2xl font-bold ${
              isKidsRoom ? "text-purple-600" : "text-blue-600"
            }`}
          >
            {isKidsRoom ? "🧒 Kids Room" : "👨‍👩‍👦 Master Room"}
          </h3>
          <button
            onClick={() => setIsEditing({ ...setIsEditing, [type]: true })}
            className={`inline-flex items-center px-4 py-2 rounded-lg text-white transition-all ${
              isKidsRoom
                ? "bg-purple-500 hover:bg-purple-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Room
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-900 mb-3">
                Room Information
              </h4>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <span className="font-medium mr-2">Title:</span>
                  <span>{room.title}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="font-medium mr-2">Subtitle:</span>
                  <span>{room.subtitle}</span>
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Description:</span>
                  <p className="mt-1">{room.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-900 mb-3">Room Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Capacity: {room.capacity} persons</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Bed className="w-4 h-4 mr-2" />
                  <span>Beds: {room.features?.numberOfBeds}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {room.availableRooms}/{room.totalRooms} rooms
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>₹{room.pricing}/night</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-900 mb-3">
                Features & Amenities
              </h4>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Bath className="w-4 h-4 mr-2" />
                  <span>
                    Attached Bathroom:{" "}
                    {room.features?.hasAttachedBathroom ? "Yes" : "No"}
                  </span>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">
                    Facilities:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {room.facilities.map((facility, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${
                          isKidsRoom
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
