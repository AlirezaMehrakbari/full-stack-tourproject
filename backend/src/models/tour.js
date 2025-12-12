import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    passengers: {
        type: Number,
        required: true,
        min: 1
    },
    passengersInfo: [{
        id: { type: Number },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        nationalId: {
            type: String,
            required: true
        },
        nationality: {
            type: String
        },
        gender: {
            type: String,
            enum: ['زن', 'مرد']
        },
        birthDate: {
            type: String
        },
        passportNumber: {
            type: String
        },
        passportExpiry: {
            type: String
        }
    }],
    travelDate: {
        type: String
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'confirmed'
    },
    bookingDate: {
        type: Date,
        default: Date.now
    }
});

const tourSchema = new mongoose.Schema(
    {
        id: { type: Number, unique: true, required: true },

        title: { type: String, required: true },
        description: { type: String, required: true },

        origin: { type: String, required: true },
        destination: { type: String, required: true },

        price: { type: Number, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        duration: { type: Number },

        totalCapacity: { type: Number, required: true },
        availableSeats: { type: Number, required: true },

        images: [{ type: String }],
        coverImage: { type: String },

        facilities: [{ type: String }],

        tourType: {
            type: String,
            enum: ['داخلی', 'خارجی', 'زیارتی'],
            default: 'داخلی'
        },

        transportation: {
            type: String,
            enum: ['هواپیما', 'اتوبوس', 'قطار', 'کشتی'],
        },

        accommodation: {
            type: { type: String },
            stars: { type: Number, min: 1, max: 5 }
        },

        meals: {
            breakfast: { type: Boolean, default: false },
            lunch: { type: Boolean, default: false },
            dinner: { type: Boolean, default: false }
        },

        itinerary: [{
            day: { type: String },
            title: { type: String },
            description: { type: String },
            activities: [{ type: String }]
        }],

        rules: [{ type: String }],
        cancellationPolicy: { type: String },

        avgRating: { type: Number, default: 0, min: 0, max: 5 },
        numReviews: { type: Number, default: 0 },

        reviews: [{
            user: { type: String },
            username: { type: String },
            rating: { type: Number, required: true, min: 1, max: 5 },
            comment: { type: String },
            reply: { type: String },
            createdAt: { type: Date, default: Date.now }
        }],

        bookings: [bookingSchema],

        status: {
            type: String,
            enum: ['active', 'inactive', 'completed', 'cancelled'],
            default: 'active'
        },

        tourGuide: {
            name: { type: String },
            phone: { type: String },
            bio: { type: String }
        },

        discount: {
            percentage: { type: Number, default: 0, min: 0, max: 100 },
            validUntil: { type: Date }
        },

        featured: { type: Boolean, default: false },
        isSpecialOffer: { type: Boolean, default: false }
    },
    { timestamps: true }
);

tourSchema.pre('save', function(next) {
    if (this.startDate && this.endDate) {
        const diffTime = Math.abs(this.endDate - this.startDate);
        this.duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    next();
});

// Auto-increment ID
tourSchema.pre("validate", async function (next) {
    if (this.id == null) {
        const lastTour = await mongoose
            .model("Tour")
            .findOne({}, { id: 1 })
            .sort({ id: -1 });

        this.id = lastTour && lastTour.id ? lastTour.id + 1 : 1;
    }
    next();
});

const Tour = mongoose.models.Tour || mongoose.model("Tour", tourSchema);
export default Tour;
