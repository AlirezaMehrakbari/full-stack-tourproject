import express from "express";
import cors from "cors";
import hotelRoutes from "./routes/hotelRoutes.js";
import villaRoutes from "./routes/villaRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/villas", villaRoutes);
app.use("/api/auth", authRoutes);


// Default route
app.get("/", (req, res) => {
    res.send("✅ Travel Backend is running!");
});

export default app;
