import express from "express";
import cors from "cors";
import hotelRoutes from "./routes/hotelRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/hotels", hotelRoutes);

// Default route
app.get("/", (req, res) => {
    res.send("✅ Travel Backend is running!");
});

export default app;
