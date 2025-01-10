import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  X,
} from "lucide-react";
import roomsService from "../../services/roomsService";
import { RoomForm, RoomDisplay } from "../form/RoomForm";

const Rooms = () => {
  const [rooms, setRooms] = useState({ master: null, kids: null });
  const [isEditing, setIsEditing] = useState({ master: false, kids: false });
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    capacity: "",
    totalRooms: "",
    availableRooms: "",
    pricing: "",
    facilities: [],
    roomType: "",
    features: {
      hasAttachedBathroom: false,
      numberOfBeds: 1,
    },
  });
  const [facilityInput, setFacilityInput] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomsService.getRoomsData();
      const roomsData = response.roomData;

      if (Array.isArray(roomsData)) {
        setRooms({
          master: roomsData.find((room) => room.roomType === "master") || null,
          kids: roomsData.find((room) => room.roomType === "kids") || null,
        });
      } else if (roomsData) {
        setRooms({
          master: roomsData.roomType === "master" ? roomsData : null,
          kids: roomsData.roomType === "kids" ? roomsData : null,
        });
      }
    } catch (err) {
      setError("Failed to fetch rooms data");
      showToastMessage("Error fetching rooms data", "error");
    }
  };

  const showToastMessage = (message, type = "success") => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const initializeForm = (roomType) => {
    const initialData = {
      title: "",
      subtitle: "",
      description: "",
      capacity: "",
      totalRooms: "",
      availableRooms: "",
      pricing: "",
      facilities: [],
      roomType: roomType,
      features: {
        hasAttachedBathroom: false,
        numberOfBeds: 1,
      },
    };

    setFormData(initialData);
    setFacilityInput("");
    setIsEditing({ ...isEditing, [roomType]: true });
    setError("");
  };

  const handleFeatureChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [name]: value,
      },
    }));
  };

  useEffect(() => {
    if (isEditing.master && rooms.master) {
      setFormData(rooms.master);
    } else if (isEditing.kids && rooms.kids) {
      setFormData(rooms.kids);
    }
  }, [isEditing, rooms]);

  const handleFacilityAdd = () => {
    if (facilityInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        facilities: [...prev.facilities, facilityInput.trim()],
      }));
      setFacilityInput("");
    }
  };

  // In Rooms.jsx
  const handleSubmit = async (e, roomType) => {
    e.preventDefault();
    setError("");

    try {
      const roomData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        totalRooms: parseInt(formData.totalRooms),
        availableRooms: parseInt(formData.availableRooms),
        pricing: parseFloat(formData.pricing),
      };

      if (isEditing[roomType] && rooms[roomType]?._id) {
        // Update existing room
        await roomsService.updateRoomData(rooms[roomType]._id, roomData);
      } else {
        // Create new room
        await roomsService.createRoomData(roomData);
      }

      await fetchRooms();
      setIsEditing({ ...isEditing, [roomType]: false });
      showToastMessage(
        isEditing[roomType]
          ? "Room updated successfully!"
          : "Room saved successfully!"
      );
    } catch (err) {
      setError(err.message || "Failed to save room");
      showToastMessage(
        `Error ${isEditing[roomType] ? "updating" : "saving"} room data`,
        "error"
      );
    }
  };

  const handleUpdate = async (e, roomType) => {
    console.log("handle update called ");
    e.preventDefault();
    if (!rooms[roomType]?._id) return;

    try {
      const response = await roomsService.updateRoomData(
        rooms[roomType]._id,
        formData
      );
      await fetchRooms();
      setIsEditing({ ...isEditing, [roomType]: false });
      showToastMessage("Room updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update room");
      showToastMessage("Error updating room data", "error");
    }
  };

  const removeFacility = (index) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Room Management</h2>
        <p className="text-gray-600 mt-2">
          Manage your hotel's master and kids rooms
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        <div>
          {!rooms.master && !isEditing.master ? (
            <button
              onClick={() => initializeForm("master")}
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Master Room
            </button>
          ) : isEditing.master ? (
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-600 mb-6">
                Edit Master Room
              </h3>
              <RoomForm
                type="master"
                formData={formData}
                handleInputChange={handleInputChange}
                handleFeatureChange={handleFeatureChange}
                handleSubmit={handleSubmit}
                facilityInput={facilityInput}
                setFacilityInput={setFacilityInput}
                handleFacilityAdd={handleFacilityAdd}
                removeFacility={removeFacility}
                setIsEditing={setIsEditing}
                isEditing={isEditing}
              />
            </div>
          ) : (
            <RoomDisplay
              room={rooms.master}
              type="master"
              setIsEditing={setIsEditing}
            />
          )}
        </div>

        <div>
          {!rooms.kids && !isEditing.kids ? (
            <button
              onClick={() => initializeForm("kids")}
              className="inline-flex items-center px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Kids Room
            </button>
          ) : isEditing.kids ? (
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-600 mb-6">
                Edit Kids Room
              </h3>
              <RoomForm
                type="kids"
                formData={formData}
                handleInputChange={handleInputChange}
                handleFeatureChange={handleFeatureChange}
                handleSubmit={handleSubmit}
                facilityInput={facilityInput}
                setFacilityInput={setFacilityInput}
                handleFacilityAdd={handleFacilityAdd}
                removeFacility={removeFacility}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
              />
            </div>
          ) : (
            <RoomDisplay
              room={rooms.kids}
              type="kids"
              setIsEditing={setIsEditing}
            />
          )}
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-4 right-4 flex flex-col gap-2">
          <div
            className={`px-6 py-3 rounded-lg shadow-lg ${
              showToast.type === "error" ? "bg-red-500" : "bg-green-500"
            } text-white transition-all transform translate-y-0`}
          >
            {showToast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
