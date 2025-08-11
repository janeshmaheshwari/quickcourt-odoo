import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import authRouter from "./routes/authRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import venueRouter from "./routes/venueRoutes.js";

//routes declaration
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/venues", venueRouter);


// app.use(notFound);
// app.use(errorHandler);

// http://localhost:8000/api/v1/users/register

export { app };
