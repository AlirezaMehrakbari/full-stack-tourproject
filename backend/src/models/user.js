import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    phoneNumber: {
        type: String,
        required: [true, 'شماره تلفن الزامی است'],
        unique: true,
        trim: true
    },
    nationalId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    firstName: {
        type: String,
        default: "",
        trim: true
    },
    lastName: {
        type: String,
        default: "",
        trim: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true
    },
    city: {
        type: String,
        default: "",
        trim: true
    },
    profileImage: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ['user', 'owner', 'admin'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String
    },
    verificationCodeExpires: {
        type: Date
    },
    favorites: {
        type: [Number],
        default: []
    }
}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
