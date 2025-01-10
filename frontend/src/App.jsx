import "./App.css";
import Home from "./components/Home/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import Layout from "./adminPanel/Layout/Layout"
import AdminHome from "./adminPanel/Dashboard/AdminHome";
import ContactAdminPanel from "./adminPanel/Dashboard/Contact";
import BookingContainer from "./booking/bookingPage/booking";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import paymentService from "./services/paymentService";
import ProtectedRoute from "./route/ProtectedRoute";
import PaymentForm from "./components/Payment/PaymentForm";
import Rooms from "./adminPanel/Dashboard/Rooms";
import Camps from "./adminPanel/Dashboard/Camps"
import ParkingManagement from "./adminPanel/Dashboard/ParkingManagement";

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
    getStripeApiKey()
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/Aboutus",
      element: <Aboutus />,
    },
    {
      path: "/Login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/confirmation",
      element: <Confirmation />,
    },
    {
      path: "/CampingTents",
      element: <Camp />,
    },
    {
      path: "/DeluxeRoom",
      element: <Room />,
    },
    {
      path: "/Gallery",
      element: <Gallery />,
    },
    {
      path: "/Corporate-Events",
      element: <Event1 />,
    },
    {
      path: "/Private-Events",
      element: <Event2 />,
    },
    {
      path: "/Activites",
      element: <Activity />,
    },
    {
      path: "/parking",
      element: <Parking />,
    },

    //Admin Login 
    {
      path: 'adminLogin',
      element: <AdminLogin />
    },
    {
      path: "dashboard",
      element: <Layout><AdminHome/></Layout>
    },
    {
      path: "contactAdminPanel",
      element: <Layout><ContactAdminPanel/></Layout>
    },
    {
      path: "rooms",
      element: <Layout><Rooms/></Layout>
    },
    {
      path: "tents",
      element: <Layout><Camps/></Layout>
    },
    {
      path: "parkingmanagement",
      element: <Layout><ParkingManagement/></Layout>
    },

     //Booking Routes
     {
      path: "/booking/:serviceType",
      element: <BookingContainer />,
    },
    {
      path: "/payment",
      element: <Elements stripe={loadStripe(stripeApiKey)}> <ProtectedRoute element={PaymentForm}></ProtectedRoute></Elements>,
    }
  ]);
  const [message, setMessage] = useState("");
  
  // useEffect(() => {
  //   fetch("https://desert-backend.onrender.com")
  //     .then((res) => res.jsonp())
  //     .then((data) => setMessage(data.message));
  // }, []);
  console.log("message::", message);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
