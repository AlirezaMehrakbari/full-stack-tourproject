import mongoose from 'mongoose';

const { Schema } = mongoose;

const villaSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: [true, 'عنوان ویلا الزامی است'],
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    province: {
        type: String,
        required: [true, 'استان الزامی است'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'شهر الزامی است'],
        trim: true
    },
    address: {
        type: String,
        default: ""
    },
    area: {
        type: Number,
        default: null
    },
    suitableFor: {
        type: String,
        enum: ['خانواده', 'دوستان', 'تنها', 'زوج', 'همه'],
        default: 'همه'
    },
    numRooms: {
        type: Number,
        default: null
    },
    numBeds: {
        type: Number,
        default: null
    },
    numBathrooms: {
        type: Number,
        default: null
    },
    floor: {
        type: Number,
        default: null
    },
    constructionYear: {
        type: Number,
        default: null
    },
    capacity: {
        type: Number,
        required: [true, 'ظرفیت الزامی است']
    },
    pricePerNight: {
        type: Number,
        required: [true, 'قیمت هر شب الزامی است']
    },
    pricePerPerson: {
        type: Number,
        default: null
    },
    owner: {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ""
        }
    },
    images: {
        type: [String],
        default: []
    },
    coverImage: {
        type: String,
        default: ""
    },
    facilities: {
        type: [String],
        default: []
    },
    reviews: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        username: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            default: ""
        },
        reply: {
            type: String,
            default: ""
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    bookedDates: [{
        from: {
            type: Date,
            required: true
        },
        to: {
            type: Date,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }],
    rules: {
        type: [String],
        default: []
    },
    cancellationPolicy: {
        type: String,
        default: 'لغو رزرو تا 7 روز قبل از تاریخ ورود، بدون جریمه'
    },
    availability: {
        type: Boolean,
        default: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'active'
    }
}, {
    timestamps: true
});

villaSchema.index({ province: 1, city: 1 });
villaSchema.index({ pricePerNight: 1 });
villaSchema.index({ 'rating.average': -1 });
villaSchema.index({ id: 1 }, { unique: true });

const Villa = mongoose.models.Villa || mongoose.model('Villa', villaSchema);

export default Villa;
