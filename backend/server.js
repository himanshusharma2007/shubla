const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const connectDB = require("./db/connectDB");
const cookieParser = require("cookie-parser");
const DB_URL = process.env.MONGO_URI;

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./router/authRouter");
const roomsRouter = require("./router/roomsRouter");
const campsRouter = require("./router/campsRouter");
const contactRouter = require("./router/contactRouter");
const imageRouter = require("./router/imageRouter");
const adminRouter = require("./router/adminRouter");
const parkingSlotRouter = require("./router/parkingSlotRouter");
const bookingRouter = require("./router/bookingRouter");

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/auth", authRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/camps", campsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/image", imageRouter);
app.use("/api/admin", adminRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/parking", parkingSlotRouter);


app.listen(process.env.PORT, async () => {
  await connectDB(DB_URL);
  console.log(`Server is running on port ${process.env.PORT}`);
});
