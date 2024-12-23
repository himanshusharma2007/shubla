import { useEffect, useState } from "react";
import "./Book.css";
import HotelData from "../../data/HotelData";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useSelector, useDispatch } from "react-redux";
import {
  decrementQuantity,
  setCheckOutDate,
} from "../../redux/availabilitySlice";
import { useNavigate } from "react-router-dom";

function Book() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const availability = useSelector((state) => state.availability.availability);
  const checkOutDate = useSelector((state) => state.availability.checkOutDate);
  const user = useSelector((state) => state.auth.user);

  const room = HotelData.find((room) => room.id === parseInt(1));
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [roomQuantity, setRoomQuantity] = useState(room.quantity);
  const [selectedRooms, setSelectedRooms] = useState(1);
  const [initialQuantity] = useState(room.quantity);
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckOutDateChange = (e) => {
    const newCheckOutDate = e.target.value;
    if (new Date(newCheckOutDate) <= new Date(selectedDate)) {
      setErrorMessage("Check-out date must be after the check-in date.");
      return;
    }
    setErrorMessage("");
    dispatch(setCheckOutDate(newCheckOutDate));
  };

  useEffect(() => {
    handleDateChange({ target: { value: today } });
  }, []);

  const calculateTotalPrice = () => {
    const checkInDate = new Date(selectedDate);
    const checkOut = new Date(checkOutDate);
    const timeDifference = checkOut - checkInDate;
    const days =
      timeDifference > 0
        ? Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
        : 0;

    const price = days * room.pricePerNight * selectedRooms;
    setTotalPrice(price);
  };

  if (!room) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger text-center" role="alert">
          Room not found
        </div>
      </div>
    );
  }

  const handleDateChange = async (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    setIsLoading(true);

    const formattedDate = new Date(date).toISOString().split("T")[0];
    const roomAvailability = availability[room.id]?.[formattedDate];

    setRoomQuantity(initialQuantity); // Reset to initial quantity

    if (roomAvailability !== undefined) {
      setAvailabilityMessage(
        roomAvailability ? "Available" : "Room not available"
      );
    } else {
      const initialAvailability = room.availability.find(
        (day) => day.date === formattedDate
      );
      if (initialAvailability) {
        setAvailabilityMessage(
          initialAvailability.available ? "Available" : "Room not available"
        );
      } else {
        setAvailabilityMessage("No data available for this date");
      }
    }
    calculateTotalPrice();
    setIsLoading(false);
  };

  const handleBooking = (e) => {
    e.preventDefault();

    if (!selectedDate || !checkOutDate) {
      setErrorMessage("Please select both check-in and check-out dates.");
      return;
    }

    if (new Date(checkOutDate) <= new Date(selectedDate)) {
      setErrorMessage("Check-out date must be after the check-in date.");
      return;
    }

    if (availabilityMessage !== "Available") {
      setErrorMessage("Room is not available for the selected dates.");
      return;
    }

    if (selectedRooms > roomQuantity) {
      setErrorMessage("Cannot book more rooms than available.");
      return;
    }

    // If all validations pass, proceed with booking
    const formattedDate = new Date(selectedDate).toISOString().split("T")[0];

    // Update local quantity
    setRoomQuantity(roomQuantity - selectedRooms);

    // Dispatch action to update Redux store
    dispatch(
      decrementQuantity({
        roomId: room.id,
        date: formattedDate,
        quantity: selectedRooms,
      })
    );

    // Navigate to confirmation page
    navigate("/confirmation", {
      state: { room, selectedDate, checkOutDate, totalPrice, selectedRooms },
    });
  };

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Redirects the user to the login page.
 * 
 * Prevents the default form submission behavior and navigates
 * to the "/login" route using the provided `navigate` function.
 *
 * @param {Event} e - The event object from the triggering event.
 */

/******  5d5865b1-1101-4d04-886c-64548fbc9d13  *******/
  const redirectToLogin = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  useEffect(() => {
    if (selectedDate && checkOutDate) {
      calculateTotalPrice();
    }
  }, [selectedDate, checkOutDate, selectedRooms]);

  return (
    <>
      <div className="booking">
        <div className="bookingfilter">
          <div className="book-1">
            <h3>
              Book Now <div className="headingline"></div>
            </h3>
            <h4>Deluxe Room & Camps</h4>
            <div id="carouselExampleSlidesOnly" className="carousel slide book-slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                      <img src="./room.jpg" className="d-block w-10"  />
                    </div>
                    <div className="carousel-item">
                      <img src="./camp.jpg" className="d-block w-10"  />
                    </div>
                </div>
            </div>

            <h4>Description</h4>
            <p>{room.description}</p>
          </div>

          <form action="">
            <div className="mb-4">
              <label htmlFor="">Available Rooms:</label>
              <p>
                {roomQuantity} room{roomQuantity > 1 ? "s" : ""} available
              </p>
            </div>
            <label htmlFor="">Select Type of Room:</label>
            <select id="cars" name="cars" className="form-select">
              <option value="room" >Deluxe Room</option>
              <option value="camp">Camping Tents</option>
            </select>
            <label htmlFor="">Check in:</label>
            <input
              type="date"
              className="form-control"
              min={today}
              value={selectedDate}
              onChange={handleDateChange}
            />

            <label htmlFor="">Check Out:</label>
            <input
              type="date"
              className="form-control"
              min={today}
              value={checkOutDate}
              onChange={handleCheckOutDateChange}
            />
            {errorMessage && (
              <div className="mt-3">
                <p className="text-danger">{errorMessage}</p>
              </div>
            )}
            {isLoading ? (
              <div className="loading-indicator mt-3">
                <p>Loading room availability...</p>
              </div>
            ) : (
              selectedDate && (
                <div className="mt-3">
                  <h5>Availability Status:</h5>
                  <p
                    className={`font-weight-bold ${
                      availabilityMessage === "Available"
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {availabilityMessage}
                  </p>
                </div>
              )
            )}

            <label htmlFor="">Select Number of Rooms:</label>
            <select
              className="form-select"
              value={selectedRooms}
              onChange={(e) => setSelectedRooms(parseInt(e.target.value))}
            >
              {[...Array(roomQuantity).keys()].map((_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1} Room{index + 1 > 1 ? "s" : ""}
                </option>
              ))}
            </select>

            <label htmlFor="">Select Number of Guests:</label>
            <select
              className="form-select"
              value={guestCount}
              onChange={(e) => {
                const newGuestCount = parseInt(e.target.value);
                setGuestCount(newGuestCount);
                dispatch(setGuestCount(newGuestCount));
              }}
            >
              {[...Array(room.maxOccupancy).keys()].map((_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1} Guest{index + 1 > 1 ? "s" : ""}
                </option>
              ))}
            </select>

            <div className="mt-3">
              <h4>Total Price: ${totalPrice.toFixed(2)}</h4>
            </div>

            {user ? (
              <button type="submit" onClick={handleBooking}>
                Book Now
              </button>
            ) : (
              <button type="button" className="" onClick={redirectToLogin}>
                Login to Book
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default Book;
