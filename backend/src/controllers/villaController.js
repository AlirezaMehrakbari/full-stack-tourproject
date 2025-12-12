import Villa from "../models/villa.js";
import User from "../models/user.js";
import mongoose from "mongoose";

const ensureAllFields = (villaDoc) => {
    const villa = villaDoc.toObject();

    const defaults = {
        description: "",
        address: "",
        area: null,
        suitableFor: [],
        numRooms: null,
        numBeds: null,
        numBathrooms: null,
        floor: null,
        constructionYear: null,
        capacity: null,
        pricePerNight: null,
        pricePerPerson: null,
        owner: {
            userId: null,
            name: "",
            phone: "",
            description: ""
        },
        images: [],
        coverImage: "",
        facilities: [],
        reviews: [],
        avgRating: 0,
        numReviews: 0,
        bookedDates: [],
        rules: [],
        cancellationPolicy: "",
        availability: true,
        featured: false,
        status: "active"
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

        if (req.query.minRating) filter.avgRating = {$gte: Number(req.query.minRating)};

        const villas = await Villa.find(filter)
            .select("id title city province pricePerNight capacity avgRating numReviews images numRooms area")
            .sort({id: 1});

        res.status(200).json(villas);
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
};


export const getVillaById = async (req, res) => {
    try {
        const villaId = Number(req.params.id);
        const villa = await Villa.findOne({id: villaId});

        if (!villa) return res.status(404).json({message: "Villa not found"});

        const formatted = ensureAllFields(villa);

        res.status(200).json(formatted);
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
};


export const createVilla = async (req, res) => {
    try {
        const {
            title,
            description,
            pricePerNight,
            pricePerPerson,
            capacity,
            numRooms,
            numBeds,
            numBathrooms,
            suitableFor,
            constructionYear,
            floor,
            area,
            province,
            city,
            address,
            facilities,
            rules,
            images,
            coverImage,
            cancellationPolicy
        } = req.body;

        if (!title || !province || !city || !pricePerNight || !capacity) {
            return res.status(400).json({
                success: false,
                message: 'لطفاً تمام فیلدهای ضروری را پر کنید (عنوان، استان، شهر، قیمت، ظرفیت)'
            });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'لطفاً ابتدا وارد شوید'
            });
        }

        const owner = await User.findById(req.user.id);

        if (!owner) {
            return res.status(404).json({
                success: false,
                message: 'کاربر یافت نشد'
            });
        }

        if (!owner.firstName || !owner.lastName) {
            return res.status(400).json({
                success: false,
                message: 'لطفاً ابتدا نام و نام خانوادگی خود را در پروفایل تکمیل کنید'
            });
        }

        const lastVilla = await Villa.findOne().sort({id: -1});
        const newId = lastVilla ? lastVilla.id + 1 : 1;

        const ownerData = {
            userId: owner._id,
            name: `${owner.firstName} ${owner.lastName}`,
            phone: owner.phoneNumber,
            description: owner.description || 'مالک ویلا'
        };

        const villa = new Villa({
            id: newId,
            title: title.trim(),
            description: description?.trim() || "",
            pricePerNight: Number(pricePerNight),
            pricePerPerson: Number(pricePerPerson) || null,
            capacity: Number(capacity),
            numRooms: numRooms ? Number(numRooms) : null,
            numBeds: numBeds ? Number(numBeds) : null,
            numBathrooms: numBathrooms ? Number(numBathrooms) : null,
            suitableFor: suitableFor || 'همه',
            constructionYear: constructionYear ? Number(constructionYear) : null,
            floor: floor ? Number(floor) : null,
            area: area ? Number(area) : null,
            province: province.trim(),
            city: city.trim(),
            address: address?.trim() || "",
            facilities: facilities || [],
            rules: rules || [],
            images: images || [],
            coverImage: coverImage || "",
            cancellationPolicy: cancellationPolicy || 'لغو رزرو تا 7 روز قبل از تاریخ ورود، بدون جریمه',
            owner: ownerData,
            rating: {
                average: 0,
                count: 0
            },
            reviews: [],
            bookedDates: [],
            availability: true,
            featured: false,
            status: 'active'
        });

        await villa.save();

        console.log('✅ Villa created successfully:', villa.id);

        res.status(201).json({
            message: "Villa created successfully",
            villa
        });
    } catch (error) {
        console.error('❌ Error creating villa:', error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

export const getMyVillas = async (req, res) => {
    try {
        const villas = await Villa.find({'owner.userId': req.user.id})
            .sort({createdAt: -1});

        res.status(200).json({
            success: true,
            count: villas.length,
            villas
        });
    } catch (error) {
        console.error('Get my villas error:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت ویلاهای شما'
        });
    }
};


export const updateVilla = async (req, res) => {
    try {
        const villaId = Number(req.params.id);
        let villa = await Villa.findOne({id: villaId});

        if (!villa) {
            return res.status(404).json({
                success: false,
                message: 'ویلا یافت نشد'
            });
        }

        if (villa.owner.userId.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'شما مجاز به ویرایش این ویلا نیستید'
            });
        }

        const owner = await User.findById(req.user.id);
        if (owner && owner.firstName && owner.lastName) {
            req.body.owner = {
                userId: owner._id,
                name: `${owner.firstName} ${owner.lastName}`,
                phone: owner.phoneNumber,
                description: owner.description || villa.owner.description
            };
        }

        villa = await Villa.findOneAndUpdate(
            {id: villaId},
            {$set: req.body},
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: 'ویلا با موفقیت به‌روزرسانی شد',
            villa
        });
    } catch (error) {
        console.error('Update villa error:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در به‌روزرسانی ویلا',
            error: error.message
        });
    }
};


export const deleteVilla = async (req, res) => {
    try {
        const villaId = Number(req.params.id);
        const villa = await Villa.findOne({id: villaId});

        if (!villa) {
            return res.status(404).json({
                success: false,
                message: 'ویلا یافت نشد'
            });
        }

        if (villa.owner.userId.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'شما مجاز به حذف این ویلا نیستید'
            });
        }

        await Villa.deleteOne({id: villaId});

        res.status(200).json({
            success: true,
            message: 'ویلا با موفقیت حذف شد'
        });
    } catch (error) {
        console.error('Delete villa error:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در حذف ویلا'
        });
    }
};


export const addReview = async (req, res) => {
    try {
        const {user, username, rating, comment} = req.body;

        const villa = await Villa.findOne({id: Number(req.params.id)});
        if (!villa) return res.status(404).json({message: "Villa not found"});

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
        res.status(500).json({message: "Server error"});
    }
};


export const bookVilla = async (req, res) => {
    try {
        const { from, to } = req.body;

        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({ message: "کاربر احراز هویت نشده است" });
        }

        const villa = await Villa.findOne({ id: Number(req.params.id) });
        if (!villa) {
            return res.status(404).json({ message: "Villa not found" });
        }

        const fromDate = new Date(from);
        const toDate = new Date(to);

        if (fromDate >= toDate) {
            return res.status(400).json({
                message: "تاریخ پایان باید بعد از تاریخ شروع باشد"
            });
        }

        villa.bookedDates.push({
            from: fromDate,
            to: toDate,
            user: new mongoose.Types.ObjectId(userId)
        });

        await villa.save();

        res.json({
            message: "Villa booked successfully",
            booking: {
                from: fromDate,
                to: toDate,
                villa: villa.title
            }
        });

    } catch (error) {
        console.error('❌ Book Villa Error:', error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



export const replyToReview = async (req, res) => {
    try {
        const villa = await Villa.findOne({id: Number(req.params.villaId)});
        if (!villa) return res.status(404).json({message: "Villa not found"});

        const review = villa.reviews.id(req.params.reviewId);
        if (!review) return res.status(404).json({message: "Review not found"});

        review.reply = req.body.reply;

        await villa.save();

        res.json({message: "Reply added successfully", review});
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
};


export const getLastUserReservation = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized - no user" });
        }

        const userId = req.user.id;

        const villas = await Villa.find({
            'bookedDates.user': userId
        });

        if (!villas || villas.length === 0) {
            return res.json(null);
        }

        let lastReservation = null;
        let lastVilla = null;

        for (const villa of villas) {
            const userBookings = villa.bookedDates.filter(
                booking => booking.user?.toString() === userId.toString()
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
            return res.json(null);
        }

        const fromDateOriginal = lastReservation.from; // Already a Date object
        const toDateOriginal = lastReservation.to;     // Already a Date object

        console.log('DEBUG: getLastUserReservation - Booking Dates:', {
            from: fromDateOriginal,
            to: toDateOriginal
        });

        const rawTimeDiffMs = toDateOriginal.getTime() - fromDateOriginal.getTime();
        console.log('DEBUG: getLastUserReservation - Raw Time Difference (ms):', rawTimeDiffMs);
        const msPerDay = (1000 * 60 * 60 * 24);
        console.log('DEBUG: getLastUserReservation - Milliseconds Per Day:', msPerDay);
        const rawDaysDiff = rawTimeDiffMs / msPerDay;
        console.log('DEBUG: getLastUserReservation - Raw Days Difference:', rawDaysDiff);

        let nights = Math.ceil(rawDaysDiff);

        if (nights === 0 && rawTimeDiffMs > 0) {
            nights = 1;
            console.warn('DEBUG: getLastUserReservation - Forcing nights to 1. Original calculation was 0 for a positive duration.');
        }

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
        console.error('❌ Error in getLastUserReservation:', error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


export const getUserReservations = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Unauthorized - user not found"
            });
        }

        const userId = req.user.id;

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({
                message: "User not found in database"
            });
        }

        const villas = await Villa.find({
            'bookedDates.user': userId
        });

        const allReservations = [];

        villas.forEach(villa => {
            const userBookings = villa.bookedDates.filter(
                booking => booking.user?.toString() === userId.toString()
            );

            userBookings.forEach(booking => {
                const fromDateOriginal = booking.from;
                const toDateOriginal = booking.to;

                console.log('DEBUG: getUserReservations - Booking Dates:', {
                    from: fromDateOriginal,
                    to: toDateOriginal
                });

                const rawTimeDiffMs = toDateOriginal.getTime() - fromDateOriginal.getTime();
                console.log('DEBUG: getUserReservations - Raw Time Difference (ms):', rawTimeDiffMs);
                const msPerDay = (1000 * 60 * 60 * 24);
                console.log('DEBUG: getUserReservations - Milliseconds Per Day:', msPerDay);
                const rawDaysDiff = rawTimeDiffMs / msPerDay;
                console.log('DEBUG: getUserReservations - Raw Days Difference:', rawDaysDiff);

                let nights = Math.ceil(rawDaysDiff);

                if (nights === 0 && rawTimeDiffMs > 0) {
                    nights = 1;
                    console.warn('DEBUG: getUserReservations - Forcing nights to 1. Original calculation was 0 for a positive duration.');
                }

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

        allReservations.sort((a, b) => new Date(b.from) - new Date(a.from));

        res.status(200).json(allReservations);

    } catch (error) {
        console.error('=== ERROR in getUserReservations ===');
        console.error(error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


export const toggleFavorite = async (req, res) => {
    try {
        console.log('=== Toggle Favorite Debug ===');
        console.log('User ID:', req.user?.id);
        console.log('Villa ID:', req.params.id);

        if (!req.user || !req.user.id) {
            return res.status(401).json({message: 'کاربر احراز هویت نشده است'});
        }

        const userId = req.user.id;
        const villaId = Number(req.params.id);

        if (isNaN(villaId)) {
            return res.status(400).json({message: 'شناسه ویلا باید عدد باشد'});
        }

        const villa = await Villa.findOne({id: villaId});

        if (!villa) {
            console.error('Villa not found with ID:', villaId);
            return res.status(404).json({message: 'ویلا یافت نشد'});
        }

        console.log('Villa found:', villa.id);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: 'کاربر یافت نشد'});
        }

        console.log('Current favorites:', user.favorites);

        const numericVillaId = villa.id;

        const isFavorite = user.favorites.includes(numericVillaId);

        console.log('Is favorite:', isFavorite);

        let updatedUser;
        if (isFavorite) {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    $pull: {favorites: numericVillaId},
                    $currentDate: {updatedAt: true}
                },
                {new: true, runValidators: true}
            );
            console.log('Removed from favorites');
        } else {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    $addToSet: {favorites: numericVillaId},
                    $currentDate: {updatedAt: true}
                },
                {new: true, runValidators: true}
            );
            console.log('Added to favorites');
        }

        console.log('Updated favorites:', updatedUser.favorites);
        console.log('=== End Debug ===');

        res.json({
            message: isFavorite ? 'ویلا از علاقه‌مندی‌ها حذف شد' : 'ویلا به علاقه‌مندی‌ها اضافه شد',
            sFavorite: !isFavorite,
            favorites: updatedUser.favorites
        });

    } catch (error) {
        console.error('❌ Toggle Favorite Error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            message: 'خطا در سرور',
            error: error.message
        });
    }
};


export const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const villas = await Villa.find({id: {$in: user.favorites}});

        res.json(villas);
    } catch (err) {
        console.error("getFavorites ERROR:", err);
        res.status(500).json({message: "Server error"});
    }
};
