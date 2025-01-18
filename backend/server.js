const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./db/connectDB");
const cookieParser = require("cookie-parser");
const DB_URL = process.env.MONGO_URI;

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log({
    method: req.method,
    url: req.url,
    origin: req.headers.origin || "No Origin Header",
    headers: req.headers,
  });
  next();
});

const allowedOrigins = [
  "https://shubla-frontend.onrender.com",
  "https://shubla-admin.onrender.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if the origin is in the allowed origins
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "X-Requested-With",
      "Accept",
    ],
    exposedHeaders: ["Set-Cookie"],
  })
);

const authRouter = require("./router/authRouter");
const roomsRouter = require("./router/roomsRouter");
const campsRouter = require("./router/campsRouter");
const contactRouter = require("./router/contactRouter");
const imageRouter = require("./router/imageRouter");
const adminRouter = require("./router/adminRouter");
const parkingSlotRouter = require("./router/parkingSlotRouter");
const bookingRouter = require("./router/bookingRouter");
const paymentRouter = require("./router/paymentRouter");
const dashboardRouter = require("./router/dashboardRouter");
const packageBookingRouter = require("./router/packageBookingRouter");
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/auth", authRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/camps", campsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/image", imageRouter);
app.use("/api/admin", adminRouter);
app.use("/api/admin/dashboard", dashboardRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/parking", parkingSlotRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/package-booking", packageBookingRouter);

app.listen(process.env.PORT, async () => {
  await connectDB(DB_URL);
  console.log(`Server is running on port ${process.env.PORT}`);
});
