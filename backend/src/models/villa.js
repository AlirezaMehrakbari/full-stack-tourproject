import mongoose from "mongoose";

const bookedDateSchema = new mongoose.Schema({
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    username: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    text: { type: String },
    reply: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const VillaSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        city: { type: String },
        province: { type: String },
        address: { type: String },
        area: { type: Number },
        suitableFor: { type: String },
        rooms: { type: Number },
        floor: { type: String },
        constructionYear: { type: Number },
        capacity: { type: Number },
        pricePerNight: { type: Number },
        pricePerPerson: { type: Number },
        ownerName: { type: String },
        ownerDescription: { type: String },
        images: [{ type: String }],
        facilities: [{ type: String }],
        reviews: [reviewSchema],
        avgRating: { type: Number, default: 0 },
        bookedDates: [bookedDateSchema]
    },
    { timestamps: true }
);

export default mongoose.model("Villa", VillaSchema);
