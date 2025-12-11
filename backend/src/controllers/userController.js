import User from '../models/User.js';

export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-verificationCode -verificationCodeExpires');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'کاربر یافت نشد'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در دریافت پروفایل',
            error: error.message
        });
    }
};

export const updateMyProfile = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            nationalId,
            birthDate,
            phoneNumber,
            city,
            email,
            profileImage,
            description
        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'کاربر یافت نشد'
            });
        }

        if (nationalId && nationalId !== user.nationalId) {
            const existingNationalId = await User.findOne({
                nationalId,
                _id: { $ne: req.user.id }
            });

            if (existingNationalId) {
                return res.status(400).json({
                    success: false,
                    message: 'این کد ملی قبلاً ثبت شده است'
                });
            }
        }

        if (phoneNumber && phoneNumber !== user.phoneNumber) {
            const existingPhone = await User.findOne({
                phoneNumber,
                _id: { $ne: req.user.id }
            });

            if (existingPhone) {
                return res.status(400).json({
                    success: false,
                    message: 'این شماره تلفن قبلاً ثبت شده است'
                });
            }
        }

        if (email && email !== user.email) {
            const existingEmail = await User.findOne({
                email,
                _id: { $ne: req.user.id }
            });

            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'این ایمیل قبلاً ثبت شده است'
                });
            }
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (nationalId !== undefined) user.nationalId = nationalId;
        if (birthDate !== undefined) user.birthDate = birthDate;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (city !== undefined) user.city = city;
        if (email !== undefined) user.email = email;
        if (profileImage !== undefined) user.profileImage = profileImage;
        if (description !== undefined) user.description = description;

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.verificationCode;
        delete userResponse.verificationCodeExpires;

        res.status(200).json({
            success: true,
            message: 'پروفایل با موفقیت به‌روزرسانی شد',
            user: userResponse
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در به‌روزرسانی پروفایل',
            error: error.message
        });
    }
};

export const deleteProfileImage = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'کاربر یافت نشد'
            });
        }

        user.profileImage = '';
        await user.save();

        res.status(200).json({
            success: true,
            message: 'عکس پروفایل با موفقیت حذف شد'
        });
    } catch (error) {
        console.error('Error deleting profile image:', error);
        res.status(500).json({
            success: false,
            message: 'خطا در حذف عکس پروفایل',
            error: error.message
        });
    }
};
