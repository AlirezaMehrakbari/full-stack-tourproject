// src/controllers/villaController.js

import Villa from "../models/Villa.js";

/* =========================================================
   ۱. دریافت لیست ویلاها با فیلتر
   ---------------------------------------------------------
   مثال:
   GET /api/villas?city=رامسر&capacity=6&minPrice=1000000&maxPrice=3000000
========================================================= */
export const getAllVillas = async (req, res) => {
    try {
        const { city, capacity, minPrice, maxPrice } = req.query;
        const query = {};

        if (city) query.city = city;
        if (capacity) query.capacity = { $gte: Number(capacity) };

        if (minPrice || maxPrice) {
            query.pricePerNight = {};
            if (minPrice) query.pricePerNight.$gte = Number(minPrice);
            if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
        }

        const villas = await Villa.find(query);

        const response = villas.map(v => ({
            _id: v._id,
            title: v.title,
            city: v.city,
            pricePerNight: v.pricePerNight,
            capacity: v.capacity,
            bedrooms: v.rooms,
            avgRating: v.avgRating || 0,
            image: v.images?.[0] || null
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error("❌ خطا در دریافت لیست ویلاها:", error);
        res.status(500).json({ message: "خطایی در سرور رخ داد." });
    }
};


/* =========================================================
   ۲. دریافت جزئیات کامل یک ویلا
========================================================= */
export const getVillaById = async (req, res) => {
    try {
        const villaId = req.params.id;
        const villa = await Villa.findById(villaId);

        if (!villa) return res.status(404).json({ message: "ویلا پیدا نشد" });

        let avgRating = 0;
        if (villa.reviews && villa.reviews.length > 0) {
            const sum = villa.reviews.reduce((acc, cur) => acc + (cur.rating || 0), 0);
            avgRating = (sum / villa.reviews.length).toFixed(1);
        }

        res.status(200).json({
            _id: villa._id,
            title: villa.title,
            description: villa.description,
            city: villa.city,
            province: villa.province,
            address: villa.address,
            area: villa.area,
            suitableFor: villa.suitableFor,
            rooms: villa.rooms,
            floor: villa.floor,
            constructionYear: villa.constructionYear,
            capacity: villa.capacity,
            pricePerNight: villa.pricePerNight,
            pricePerPerson: villa.pricePerPerson,
            ownerName: villa.ownerName,
            ownerDescription: villa.ownerDescription,
            images: villa.images,
            facilities: villa.facilities,
            reviews: villa.reviews,
            avgRating: Number(avgRating),
            bookedDates: villa.bookedDates,
            createdAt: villa.createdAt
        });
    } catch (error) {
        console.error("❌ خطا در دریافت ویلا:", error);
        res.status(500).json({ message: "خطایی در سرور رخ داد." });
    }
};


/* =========================================================
   ۳. رزرو ویلا (بررسی تداخل تاریخ و ثبت رزرو)
========================================================= */
export const bookVilla = async (req, res) => {
    try {
        const villaId = req.params.id;
        const { startDate, endDate, userId } = req.body;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "تاریخ شروع و پایان الزامی است." });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const villa = await Villa.findById(villaId);
        if (!villa) return res.status(404).json({ message: "ویلا یافت نشد." });

        const hasConflict = villa.bookedDates?.some(b => {
            const bookedStart = new Date(b.start);
            const bookedEnd = new Date(b.end);
            return (start <= bookedEnd && end >= bookedStart);
        });

        if (hasConflict)
            return res.status(409).json({ message: "این تاریخ قبلاً رزرو شده است." });

        villa.bookedDates.push({ start, end, user: userId });
        await villa.save();

        res.status(201).json({
            message: "رزرو با موفقیت ثبت شد.",
            bookedDates: villa.bookedDates
        });
    } catch (error) {
        console.error("❌ خطا در رزرو ویلا:", error);
        res.status(500).json({ message: "مشکلی در سرور رخ داد." });
    }
};


/* =========================================================
   ۴. ثبت دیدگاه کاربر برای ویلا
========================================================= */
export const addReview = async (req, res) => {
    try {
        const villaId = req.params.id;
        const { userId, username, rating, text } = req.body;

        if (!rating || !text) {
            return res.status(400).json({ message: "امتیاز و متن دیدگاه الزامی است." });
        }

        const villa = await Villa.findById(villaId);
        if (!villa) return res.status(404).json({ message: "ویلا پیدا نشد." });

        const newReview = {
            user: userId,
            username,
            rating: Number(rating),
            text,
            createdAt: new Date()
        };

        villa.reviews.push(newReview);

        // بروزرسانی میانگین امتیاز
        const sum = villa.reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
        villa.avgRating = (sum / villa.reviews.length).toFixed(1);

        await villa.save();

        res.status(201).json({
            message: "دیدگاه با موفقیت ثبت شد.",
            reviews: villa.reviews,
            avgRating: villa.avgRating
        });
    } catch (error) {
        console.error("❌ خطا در ثبت دیدگاه:", error);
        res.status(500).json({ message: "خطایی در سرور رخ داد." });
    }
};


/* =========================================================
   ۵. پاسخ ادمین یا مالک ویلا به دیدگاه کاربر
========================================================= */
export const replyToReview = async (req, res) => {
    try {
        const { villaId, reviewId } = req.params;
        const { replyText } = req.body;

        if (!replyText) {
            return res.status(400).json({ message: "متن پاسخ الزامی است." });
        }

        const villa = await Villa.findById(villaId);
        if (!villa) return res.status(404).json({ message: "ویلا پیدا نشد." });

        const review = villa.reviews.id(reviewId);
        if (!review) return res.status(404).json({ message: "دیدگاه پیدا نشد." });

        review.reply = replyText;
        await villa.save();

        res.status(200).json({ message: "پاسخ ثبت شد.", review });
    } catch (error) {
        console.error("❌ خطا در پاسخ به دیدگاه:", error);
        res.status(500).json({ message: "مشکلی در سرور رخ داد." });
    }
};
