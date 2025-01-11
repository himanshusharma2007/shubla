import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Register from "./components/register/Register";
import Confirmation from "./components/confirmation/Comfirmation";
import Aboutus from "./components/aboutus/Aboutus";
import Camp from "./components/CampingTents/Camp";
import Room from "./components/DeluxRoom/Room";
import Gallery from "./components/Gallery/Gallery";
import Event1 from "./components/Event/Event1";
import Event2 from "./components/Event/Event2";
import Activity from "./components/Activity/Activity";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "./redux/authSlice";
import Parking from "./components/parking/PArking";
import AdminLogin from "./adminPanel/Login/AdminLogin";
import Layout from "./adminPanel/Layout/Layout";
import AdminHome from "./adminPanel/Dashboard/AdminHome";
import ContactAdminPanel from "./adminPanel/Dashboard/Contact";
import BookingContainer from "./booking/bookingPage/Booking";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import paymentService from "./services/paymentService";
import ProtectedRoute from "./route/ProtectedRoute";
import PaymentForm from "./components/Payment/PaymentForm";
import Rooms from "./adminPanel/Dashboard/Rooms";
import Camps from "./adminPanel/Dashboard/Camps";

function App() {
  const dispatch = useDispatch();
  const [stripeApiKey, setStripeApiKey] = useState("");
  const [stripePromise, setStripePromise] = useState(null);

  async function getStripeApiKey() {
    const data = await paymentService.stripeapikey();
    setStripeApiKey(data.stripeApiKey);
    setStripePromise(loadStripe(data.stripeApiKey));
  }

  useEffect(() => {
    dispatch(fetchUser());
    getStripeApiKey();
  }, [dispatch]);

  const [message, setMessage] = useState("");
  console.log("message::", message);

  return (
    <BrowserRouter>
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/Aboutus" element={<Aboutus />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/CampingTents" element={<Camp />} />
        <Route path="/DeluxeRoom" element={<Room />} />
        <Route path="/Gallery" element={<Gallery />} />
        <Route path="/Corporate-Events" element={<Event1 />} />
        <Route path="/Private-Events" element={<Event2 />} />
        <Route path="/Activites" element={<Activity />} />
        <Route path="/parking" element={<Parking />} />

        {/* Admin Routes */}
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Layout><AdminHome /></Layout>} />
        <Route path="/contactAdminPanel" element={<Layout><ContactAdminPanel /></Layout>} />
        <Route path="/rooms" element={<Layout><Rooms /></Layout>} />
        <Route path="/tents" element={<Layout><Camps /></Layout>} />

        {/* Booking Routes */}
        <Route path="/booking/:serviceType" element={<BookingContainer />} />
        <Route 
          path="/payment" 
          element={
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute element={PaymentForm} />
            </Elements>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;