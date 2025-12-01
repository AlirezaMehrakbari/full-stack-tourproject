import Villa from "../models/Villa.js";
import User from "../models/User.js";


const ensureAllFields = (villaDoc) => {
    const villa = villaDoc.toObject();

    const defaults = {
        description: "",
        address: "",
        area: null,
        suitableFor: [],
        numRooms: null,
        floor: null,
        constructionYear: null,
        capacity: null,
        pricePerPerson: null,
        ownerName: "",
        ownerDescription: "",
        images: [],
        facilities: [],
        reviews: [],
        avgRating: 0,
        numReviews: 0,
        bookedDates: [],
        rules: []
    };

    for (const [key, val] of Object.entries(defaults)) {
        if (!villa.hasOwnProperty(key)) villa[key] = val;
    }

    return villa;
};


export const getAllVillas = async (req, res) => {
    try {
        const filter = {};

        if (req.query.city) filter.city = new RegExp(req.query.city, "i");
        if (req.query.province) filter.province = new RegExp(req.query.province, "i");

        if (req.query.minPrice || req.query.maxPrice) {
            filter.pricePerNight = {};
            if (req.query.minPrice) filter.pricePerNight.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) filter.pricePerNight.$lte = Number(req.query.maxPrice);
        }

        if (req.query.minCapacity || req.query.maxCapacity) {
            filter.capacity = {};
            if (req.query.minCapacity) filter.capacity.$gte = Number(req.query.minCapacity);
            if (req.query.maxCapacity) filter.capacity.$lte = Number(req.query.maxCapacity);
        }

        if (req.query.minRating) filter.avgRating = { $gte: Number(req.query.minRating) };

        const villas = await Villa.find(filter)
            .select("id title city province pricePerNight capacity avgRating numReviews images numRooms area")
            .sort({ id: 1 });

        res.status(200).json(villas);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


export const getVillaById = async (req, res) => {
    try {
        const villaId = Number(req.params.id);
        const villa = await Villa.findOne({ id: villaId });

        if (!villa) return res.status(404).json({ message: "Villa not found" });

        const formatted = ensureAllFields(villa);

        res.status(200).json(formatted);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


export const createVilla = async (req, res) => {
    try {
        const data = { ...req.body };
        delete data._id;
        delete data.id;

        const villa = new Villa(data);

        await villa.save();

        res.status(201).json({
            message: "Villa created successfully",
            villa
        });
    } catch (error) {
        console.error("Error creating villa:", error);
        res.status(500).json({ message: "Server error" });
    }
};



export const addReview = async (req, res) => {
    try {
        const { user, username, rating, comment } = req.body;

        const villa = await Villa.findOne({ id: Number(req.params.id) });
        if (!villa) return res.status(404).json({ message: "Villa not found" });

        const newReview = {
            user,
            username,
            rating,
            comment,
            createdAt: new Date()
        };

        villa.reviews.push(newReview);

        villa.numReviews = villa.reviews.length;
        villa.avgRating =
            villa.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
            villa.numReviews;

        await villa.save();

        res.status(201).json({
            message: "Review added successfully",
            avgRating: villa.avgRating,
            numReviews: villa.numReviews,
            review: newReview
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const bookVilla = async (req, res) => {
    try {
        const { from, to, user } = req.body;

        const villa = await Villa.findOne({ id: Number(req.params.id) });
        if (!villa) return res.status(404).json({ message: "Villa not found" });

        villa.bookedDates.push({ from, to, user });

        await villa.save();

        res.json({ message: "Villa booked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


export const replyToReview = async (req, res) => {
    try {
        const villa = await Villa.findOne({ id: Number(req.params.villaId) });
        if (!villa) return res.status(404).json({ message: "Villa not found" });

        const review = villa.reviews.id(req.params.reviewId);
        if (!review) return res.status(404).json({ message: "Review not found" });

        review.reply = req.body.reply;

        await villa.save();

        res.json({ message: "Reply added successfully", review });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

function calculateNights(from, to) {
    const start = new Date(from);
    const end = new Date(to);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
}

// villaController.js

export const getLastUserReservation = async (req, res) => {
    try {
        console.log('\n=== GET LAST RESERVATION ===');
        console.log('User ID:', req.user?.id);

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized - no user" });
        }

        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized - user not found" });
        }

        console.log('✅ User found:', user.email);

        // پیدا کردن ویلاهایی که این کاربر رزرو دارد
        const villas = await Villa.find({
            'bookedDates.user': userId
        });

        console.log('Villas found:', villas.length);

        if (!villas || villas.length === 0) {
            return res.json({
                message: "No reservations found",
                reservation: null
            });
        }

        let lastReservation = null;
        let lastVilla = null;

        // پیدا کردن آخرین رزرو
        for (const villa of villas) {
            const userBookings = villa.bookedDates.filter(
                booking => booking.user === userId
            );

            for (const booking of userBookings) {
                const bookingDate = new Date(booking.from);
                if (!lastReservation || bookingDate > new Date(lastReservation.from)) {
                    lastReservation = booking;
                    lastVilla = villa;
                }
            }
        }

        if (!lastReservation) {
            return res.json({
                message: "No reservations found",
                reservation: null
            });
        }

        // محاسبه تعداد شب‌ها
        const fromDate = new Date(lastReservation.from);
        const toDate = new Date(lastReservation.to);
        const nights = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24));

        console.log('✅ Last reservation found');

        // ساختار دقیق برای کامپوننت Reserve
        res.json({
            title: lastVilla.title,
            province: lastVilla.province,
            city: lastVilla.city,
            from: lastReservation.from,
            to: lastReservation.to,
            pricePerNight: lastVilla.pricePerNight,
            capacity: lastVilla.capacity,
            nights: nights,
            totalPrice: lastVilla.pricePerNight * nights,
            imageUrl: lastVilla.images[0] || '/default-villa.jpg'
        });

    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

export const getUserReservations = async (req, res) => {
    try {
        console.log('=== getUserReservations START ===');

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Unauthorized - user not found"
            });
        }

        const userId = req.user.id;
        console.log('User ID:', userId);

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({
                message: "User not found in database"
            });
        }

        console.log('✅ User found:', userExists.email);

        const villas = await Villa.find({
            'bookedDates.user': userId
        });

        console.log('Villas with reservations:', villas.length);

        const allReservations = [];

        villas.forEach(villa => {
            const userBookings = villa.bookedDates.filter(
                booking => booking.user === userId
            );

            userBookings.forEach(booking => {
                // محاسبه تعداد شب‌ها
                const fromDate = new Date(booking.from);
                const toDate = new Date(booking.to);
                const nights = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24));

                // ساختار دقیق برای کامپوننت Reserve
                allReservations.push({
                    _id: booking._id,
                    title: villa.title,
                    province: villa.province,
                    city: villa.city,
                    from: booking.from,
                    to: booking.to,
                    pricePerNight: villa.pricePerNight,
                    capacity: villa.capacity,
                    nights: nights,
                    totalPrice: villa.pricePerNight * nights,
                    imageUrl: villa.images[0] || '/default-villa.jpg'
                });
            });
        });

        // مرتب‌سازی بر اساس تاریخ (جدیدترین اول)
        allReservations.sort((a, b) =>
            new Date(b.from) - new Date(a.from)
        );

        console.log('Total reservations:', allReservations.length);
        console.log('=== getUserReservations END ===');

        res.status(200).json(allReservations);

    } catch (error) {
        console.error('=== ERROR ===');
        console.error(error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

