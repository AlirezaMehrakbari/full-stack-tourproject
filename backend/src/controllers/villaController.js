import Villa from "../models/Villa.js";

/**
 * Helper: اطمینان از وجود تمام فیلدها در خروجی (فقط در getVillaById)
 */
const ensureAllFields = (villaDoc) => {
    const villa = villaDoc.toObject();

    const defaults = {
        description: "",
        address: "",
        area: null,
        suitableFor: "",
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
    };

    // با گشتن روی defaults مقادیر خالی اضافه کن
    for (const [key, val] of Object.entries(defaults)) {
        if (!villa.hasOwnProperty(key)) villa[key] = val;
    }

    return villa;
};

/**
 * GET /api/villas
 * لیست همه ویلاها (خروجی سبک)
 */
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

        // خروجی ساده بدون اجباری کردن فیلدهای خالی
        res.status(200).json(villas);
    } catch (error) {
        console.error("Error fetching villas:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * GET /api/villas/:id
 * جزئیات کامل ویلا با تضمین تمام فیلدها
 */
export const getVillaById = async (req, res) => {
    try {
        const villaId = Number(req.params.id);
        const villa = await Villa.findOne({ id: villaId });

        if (!villa) return res.status(404).json({ message: "Villa not found" });

        // اینجا تضمین می‌کنیم همه فیلدها بیان
        const formatted = ensureAllFields(villa);

        res.status(200).json(formatted);
    } catch (error) {
        console.error("Error getting villa:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * POST /api/villas
 * افزودن ویلا جدید
 */
export const createVilla = async (req, res) => {
    try {
        const {
            title,
            description,
            city,
            province,
            address,
            area,
            suitableFor,
            numRooms,
            floor,
            constructionYear,
            capacity,
            pricePerNight,
            pricePerPerson,
            ownerName,
            ownerDescription,
            images,
            facilities,
        } = req.body;

        const villa = new Villa({
            title,
            description,
            city,
            province,
            address,
            area,
            suitableFor,
            numRooms,
            floor,
            constructionYear,
            capacity,
            pricePerNight,
            pricePerPerson,
            ownerName,
            ownerDescription,
            images,
            facilities,
        });

        await villa.save();

        res.status(201).json({
            id: villa.id,
            title: villa.title,
            city: villa.city,
            province: villa.province,
            pricePerNight: villa.pricePerNight,
            capacity: villa.capacity,
            numRooms: villa.numRooms,
            area: villa.area,
        });
    } catch (error) {
        console.error("Error creating villa:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * POST /api/villas/:id/review
 */
export const addReview = async (req, res) => {
    try {
        const { user, username, rating, text } = req.body;
        const villa = await Villa.findOne({ id: Number(req.params.id) });
        if (!villa) return res.status(404).json({ message: "Villa not found" });

        const newReview = { user, username, rating, text, createdAt: new Date() };
        villa.reviews.push(newReview);

        villa.numReviews = villa.reviews.length;
        const avg = villa.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / villa.numReviews;
        villa.avgRating = parseFloat(avg.toFixed(1));

        await villa.save();

        res.status(201).json({
            message: "Review added successfully",
            numReviews: villa.numReviews,
            avgRating: villa.avgRating,
            review: newReview,
        });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * PUT /api/villas/:id/book
 */
export const bookVilla = async (req, res) => {
    try {
        const { start, end, user } = req.body;
        const villa = await Villa.findOne({ id: Number(req.params.id) });
        if (!villa) return res.status(404).json({ message: "Villa not found" });

        villa.bookedDates.push({ start, end, user });
        await villa.save();

        res.json({ message: "Villa booked successfully" });
    } catch (error) {
        console.error("Error booking villa:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * POST /api/villas/:villaId/reviews/:reviewId/reply
 */
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
        console.error("Error replying to review:", error);
        res.status(500).json({ message: "Server error" });
    }
};
