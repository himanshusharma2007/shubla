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

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
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
const paymentRouter = require("./router/paymentRouter")
const dashboardRouter = require("./router/dashboardRouter")
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
app.use("/api/admin/dashboard", dashboardRouter );
app.use("/api/booking", bookingRouter);
app.use("/api/parking", parkingSlotRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/package-booking", packageBookingRouter);

app.listen(process.env.PORT, async () => {
  await connectDB(DB_URL);
  console.log(`Server is running on port ${process.env.PORT}`);
});
