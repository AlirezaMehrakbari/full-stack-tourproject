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

export const getLastUserReservation = async (req, res) => {
    try {
        console.log('\n=== GET LAST RESERVATION ===');
        console.log('req.user:', req.user);
        console.log('User ID:', req.user?.id);

        if (!req.user || !req.user.id) {
            console.log('❌ No user in request');
            return res.status(401).json({ message: "Unauthorized - no user" });
        }

        console.log('Searching for user:', req.user.id);
        const user = await User.findById(req.user.id);

        if (!user) {
            console.log('❌ User not found in database');
            return res.status(401).json({ message: "Unauthorized - user not found" });
        }

        console.log('✅ User found:', user.email);
        console.log('Searching for villas with this user\'s reservations...');

        const villas = await Villa.find({
            'books.user': req.user.id
        }).sort({ 'books.from': -1 });

        console.log('Villas found:', villas.length);

        if (!villas || villas.length === 0) {
            console.log('No villas with reservations found');
            return res.json({ message: "No reservations found", reservation: null });
        }

        let lastReservation = null;
        let lastVilla = null;

        for (const villa of villas) {
            const userBooks = villa.books.filter(
                book => book.user.toString() === req.user.id
            );

            console.log(`Villa ${villa.title}: ${userBooks.length} reservations`);

            for (const book of userBooks) {
                if (!lastReservation || new Date(book.from) > new Date(lastReservation.from)) {
                    lastReservation = book;
                    lastVilla = villa;
                }
            }
        }

        if (!lastReservation) {
            console.log('No reservation found for this user');
            return res.json({ message: "No reservations found", reservation: null });
        }

        console.log('✅ Last reservation found');

        res.json({
            villa: {
                id: lastVilla._id,
                title: lastVilla.title,
                images: lastVilla.images
            },
            reservation: {
                from: lastReservation.from,
                to: lastReservation.to,
                totalPrice: lastReservation.totalPrice,
                status: lastReservation.status
            }
        });

    } catch (error) {
        console.error('❌ Error in getLastUserReservation:', error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



export const getUserReservations = async (req, res) => {
    try {
        console.log('=== getUserReservations START ===');
        console.log('req.user:', req.user);
        console.log('req.userId:', req.userId);

        const userId = req.user?.id || req.userId;

        if (!userId) {
            console.log('ERROR: No userId found');
            return res.status(401).json({
                message: "Unauthorized - user not found"
            });
        }

        console.log('Searching for user:', userId);
        const userExists = await User.findById(userId);
        console.log('User exists:', !!userExists);

        if (!userExists) {
            return res.status(404).json({
                message: "User not found in database"
            });
        }

        console.log('Fetching reservations for user:', userId);
        const reservations = await Book.find({ user: userId })
            .populate('villa')
            .sort({ createdAt: -1 });

        console.log('Reservations count:', reservations.length);
        console.log('=== getUserReservations END ===');

        res.status(200).json(reservations);

    } catch (error) {
        console.error('=== ERROR in getUserReservations ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);

        res.status(500).json({
            message: "Server error",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};