import Villa from "../models/Villa.js";


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
