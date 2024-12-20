import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import './Comfirmation.css'

function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate()
  const { room, selectedDate, checkOutDate, totalPrice, selectedRooms } = location.state || {};
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="confirmation">
        <h2>Booking Confirmation</h2>
       <img src="./logo.png" alt="" />
      
      {room ? (
        <>
          <h3>Thank You, {user ? user.name : 'Guest'}!</h3>
          <p>Your booking has been confirmed.</p>
          <h4>Booking Details</h4>
          <p><strong>Room Name:</strong> {room.name}</p>
          <p><strong>Description:</strong> {room.description}</p>
          <p><strong>Check-In Date:</strong> {selectedDate}</p>
          <p><strong>Check-Out Date:</strong> {checkOutDate}</p>
          <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>
          <p><strong>Number of Rooms:</strong> {selectedRooms}</p>
          <button className="" onClick={() => navigate('/')}>Back to Home</button>
        </>
      ) : (
        <p>No booking details available.</p>
      )}
    </div>
  );
}

export default Confirmation;
