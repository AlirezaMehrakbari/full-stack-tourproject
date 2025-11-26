import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: { type: String },
    username: { type: String },
    rating: { type: Number },
    comment: { type: String },
    reply: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const bookedSchema = new mongoose.Schema({
    from: { type: String },
    to: { type: String },
    user: { type: String }
});

const villaSchema = new mongoose.Schema(
    {
        id: { type: Number, unique: true, required: true },

        title: { type: String, required: true },
        description: { type: String, required: true },

        pricePerNight: { type: Number, required: true },
        pricePerPerson: { type: Number },

        capacity: { type: Number, required: true },
        numRooms: { type: Number },
        suitableFor: [{ type: String }],
        constructionYear: { type: Number },
        floor: { type: Number },
        area: { type: Number },

        province: { type: String, required: true },
        city: { type: String, required: true },
        address: { type: String },

        terrainType: { type: String },

        facilities: [{ type: String }],
        images: [{ type: String }],

        location: {
            lat: { type: Number },
            lng: { type: Number }
        },

        rules: [{ type: String }],

        ownerName: { type: String },
        ownerDescription: { type: String },

        avgRating: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },

        reviews: [reviewSchema],
        bookedDates: [bookedSchema]
    },
    { timestamps: true }
);

villaSchema.pre("validate", async function (next) {
    if (this.id == null) {
        const lastVilla = await mongoose
            .model("Villa")
            .findOne({}, { id: 1 })
            .sort({ id: -1 });

        this.id = lastVilla && lastVilla.id ? lastVilla.id + 1 : 1;
    }
    next();
});

const Villa = mongoose.models.Villa || mongoose.model("Villa", villaSchema);
export default Villa;
