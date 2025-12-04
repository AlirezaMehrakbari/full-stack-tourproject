import Tour from "../models/Tour.js";

export const getAllTours = async (req, res) => {
    try {
        const filter = {};

        if (req.query.origin) {
            filter.origin = new RegExp(req.query.origin, "i");
        }

        if (req.query.destination) {
            filter.destination = new RegExp(req.query.destination, "i");
        }

        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
        }

        if (req.query.startDate) {
            filter.startDate = { $gte: new Date(req.query.startDate) };
        }

        if (req.query.endDate) {
            filter.endDate = { $lte: new Date(req.query.endDate) };
        }

        if (req.query.passengers) {
            filter.availableSeats = { $gte: Number(req.query.passengers) };
        }

        if (req.query.tourType) {
            filter.tourType = req.query.tourType;
        }

        if (req.query.transportation) {
            filter.transportation = req.query.transportation;
        }

        if (req.query.minRating) {
            filter.avgRating = { $gte: Number(req.query.minRating) };
        }

        if (!req.query.showInactive) {
            filter.status = 'active';
        }

        if (req.query.featured === 'true') {
            filter.featured = true;
        }

        if (req.query.isSpecialOffer === 'true') {
            filter.isSpecialOffer = true;
        }

        let sortOption = {};

        switch (req.query.sortBy) {
            case 'newest':
                sortOption = { createdAt: -1 };
                break;
            case 'cheapest':
                sortOption = { price: 1 };
                break;
            case 'expensive':
                sortOption = { price: -1 };
                break;
            case 'nearestDate':
                sortOption = { startDate: 1 };
                break;
            case 'rating':
                sortOption = { avgRating: -1 };
                break;
            default:
                sortOption = { featured: -1, createdAt: -1 }; // پیشنهاد ما
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const tours = await Tour.find(filter)
            .select("-bookings -reviews")
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        const total = await Tour.countDocuments(filter);

        res.status(200).json({
            tours,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalTours: total
        });

    } catch (error) {
        console.error("Error in getAllTours:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getTourById = async (req, res) => {
    try {
        const tour = await Tour.findOne({ id: req.params.id });

        if (!tour) {
            return res.status(404).json({ message: "تور یافت نشد" });
        }

        res.status(200).json(tour);
    } catch (error) {
        console.error("Error in getTourById:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const createTour = async (req, res) => {
    try {
        const tour = await Tour.create(req.body);
        res.status(201).json({
            message: "تور با موفقیت ایجاد شد",
            tour
        });
    } catch (error) {
        console.error("Error in createTour:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateTour = async (req, res) => {
    try {
        const tour = await Tour.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );

        if (!tour) {
            return res.status(404).json({ message: "تور یافت نشد" });
        }

        res.status(200).json({
            message: "تور با موفقیت ویرایش شد",
            tour
        });
    } catch (error) {
        console.error("Error in updateTour:", error);
        res.status(500).json({ message: "Server error" });
    }
};


export const deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findOneAndDelete({ id: req.params.id });

        if (!tour) {
            return res.status(404).json({ message: "تور یافت نشد" });
        }

        res.status(200).json({ message: "تور حذف شد" });
    } catch (error) {
        console.error("Error in deleteTour:", error);
        res.status(500).json({ message: "Server error" });
    }
};


export const bookTour = async (req, res) => {
    try {
        const { passengers } = req.body;

        const tour = await Tour.findOne({ id: req.params.id });

        if (!tour) {
            return res.status(404).json({ message: "تور یافت نشد" });
        }

        if (tour.availableSeats < passengers) {
            return res.status(400).json({
                message: "ظرفیت کافی نیست"
            });
        }

        const totalPrice = tour.price * passengers;

        const booking = {
            user: req.user.id,
            username: req.user.username,
            passengers,
            totalPrice
        };

        tour.bookings.push(booking);
        tour.availableSeats -= passengers;

        await tour.save();

        res.status(200).json({
            message: "رزرو با موفقیت انجام شد",
            booking
        });
    } catch (error) {
        console.error("Error in bookTour:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const addReview = async (req, res) => {
    try {
        const tour = await Tour.findOne({ id: req.params.id });

        if (!tour) {
            return res.status(404).json({ message: "تور یافت نشد" });
        }

        const review = {
            user: req.user.id,
            username: req.user.username,
            rating: req.body.rating,
            comment: req.body.comment
        };

        tour.reviews.push(review);
        tour.numReviews = tour.reviews.length;

        tour.avgRating =
            tour.reviews.reduce((sum, r) => sum + r.rating, 0) / tour.numReviews;

        await tour.save();

        res.status(200).json({
            message: "نظر ثبت شد",
            review
        });
    } catch (error) {
        console.error("Error in addReview:", error);
        res.status(500).json({ message: "Server error" });
    }
};



