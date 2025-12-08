'use client';

import {useState} from 'react';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import SuperAdminNavbar from "@/app/components/superAdmin/SuperAdminNavbar";
import {tripTourApi} from "@/axios-instances";

export default function CreateTourAdmin() {
    const formatCurrency = (value) => {
        if (!value) return '';
        const numericValue = value.toString().replace(/,/g, '');
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const parseCurrency = (value) => {
        return parseInt(value.toString().replace(/,/g, '')) || 0;
    };

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        origin: '',
        destination: '',
        startDate: '',
        endDate: '',
        duration: 0,
        price: '',
        totalCapacity: '',
        availableSeats: '',
        tourType: 'داخلی',
        transportation: 'اتوبوس',
        accommodation: {
            type: '',
            hotelName: '',
            stars: 0,
            roomType: ''
        },
        meals: {
            breakfast: false,
            lunch: false,
            dinner: false
        },
        tourGuide: {
            name: '',
            phone: '',
            bio: ''
        },
        facilities: [],
        itinerary: [],
        rules: [],
        cancellationPolicy: '',
        discount: {
            percentage: 0,
            validUntil: ''
        },
        images: [],
        coverImage: '',
        featured: false,
        isSpecialOffer: false,
        status: 'active'
    });

    const [newFacility, setNewFacility] = useState('');
    const [newRule, setNewRule] = useState('');
    const [newDay, setNewDay] = useState({day: '', title: '', description: ''});
    const [newImageUrl, setNewImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const {name, value, type, checked} = e.target;

        if (name === 'duration') {
            return;
        }

        if (name === 'price') {
            const numericValue = parseCurrency(value);
            setFormData(prev => ({
                ...prev,
                [name]: numericValue
            }));
            return;
        }

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleDateChange = (dates) => {
        if (dates && dates.length === 2) {
            const startDate = dates[0].toDate();
            const endDate = dates[1].toDate();
            const diffTime = Math.abs(endDate - startDate);
            const duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            setFormData(prev => ({
                ...prev,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                duration: duration
            }));
        }
    };

    const addFacility = () => {
        if (newFacility.trim()) {
            setFormData(prev => ({
                ...prev,
                facilities: [...prev.facilities, newFacility.trim()]
            }));
            setNewFacility('');
        }
    };

    const removeFacility = (index) => {
        setFormData(prev => ({
            ...prev,
            facilities: prev.facilities.filter((_, i) => i !== index)
        }));
    };

    const addRule = () => {
        if (newRule.trim()) {
            setFormData(prev => ({
                ...prev,
                rules: [...prev.rules, newRule.trim()]
            }));
            setNewRule('');
        }
    };

    const removeRule = (index) => {
        setFormData(prev => ({
            ...prev,
            rules: prev.rules.filter((_, i) => i !== index)
        }));
    };

    const addItineraryDay = () => {
        if (newDay.day && newDay.title && newDay.description) {
            setFormData(prev => ({
                ...prev,
                itinerary: [...prev.itinerary, {...newDay}]
            }));
            setNewDay({day: '', title: '', description: ''});
        }
    };

    const removeItineraryDay = (index) => {
        setFormData(prev => ({
            ...prev,
            itinerary: prev.itinerary.filter((_, i) => i !== index)
        }));
    };

    const addImageUrl = () => {
        if (newImageUrl.trim() && newImageUrl.startsWith('http')) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, newImageUrl.trim()]
            }));
            setNewImageUrl('');
        } else {
            alert('⚠️ لطفاً یک URL معتبر وارد کنید');
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.title || !formData.description || !formData.price) {
                alert('⚠️ لطفاً فیلدهای الزامی را پر کنید');
                setLoading(false);
                return;
            }

            if (!formData.startDate || !formData.endDate) {
                alert('⚠️ لطفاً تاریخ‌های سفر را انتخاب کنید');
                setLoading(false);
                return;
            }

            const tourData = {
                ...formData,
                price: parseCurrency(formData.price),
                totalCapacity: Number(formData.totalCapacity),
                availableSeats: Number(formData.totalCapacity),
                discount: {
                    percentage: Number(formData.discount.percentage),
                    validUntil: formData.discount.validUntil || null
                },
                accommodation: {
                    ...formData.accommodation,
                    stars: Number(formData.accommodation.stars)
                }
            };

            const response = await tripTourApi.post('tours', tourData);

            if (response.status === 201 || response.status === 200) {
                alert('✅ تور با موفقیت ایجاد شد!');
                window.location.reload();
            }
        } catch (error) {
            console.error('❌ Error:', error);

            if (error.response) {
                alert(`❌ خطا: ${error.response.data?.message || 'خطا در ایجاد تور'}`);
            } else if (error.request) {
                alert('❌ خطا در اتصال به سرور');
            } else {
                alert(`❌ خطا: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
    const textareaClass = "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none";
    const selectClass = "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
    const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

    return (
        <>
            <SuperAdminNavbar/>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ایجاد تور جدید
                        </h1>
                        <p className="text-center text-gray-500 mb-8">
                            لطفاً اطلاعات تور را با دقت وارد کنید
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-blue-500 pb-2">
                                        📌 اطلاعات اصلی
                                    </h3>

                                    <div>
                                        <label className={labelClass}>عنوان تور *</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className={inputClass}
                                            placeholder="تور ۷ روزه بانکوک و پاتایا"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>توضیحات *</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className={textareaClass}
                                            placeholder="توضیحات کامل تور..."
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClass}>مبدأ *</label>
                                            <input
                                                type="text"
                                                name="origin"
                                                value={formData.origin}
                                                onChange={handleInputChange}
                                                className={inputClass}
                                                placeholder="تهران"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>مقصد *</label>
                                            <input
                                                type="text"
                                                name="destination"
                                                value={formData.destination}
                                                onChange={handleInputChange}
                                                className={inputClass}
                                                placeholder="بانکوک، تایلند"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-green-500 pb-2">
                                        💰 قیمت و ظرفیت
                                    </h3>

                                    <div>
                                        <label className={labelClass}>قیمت (تومان) *</label>
                                        <input
                                            type="text"
                                            name="price"
                                            value={formatCurrency(formData.price)}
                                            onChange={handleInputChange}
                                            className={inputClass}
                                            placeholder="42,500,000"
                                            required
                                        />
                                        {formData.price && (
                                            <p className="text-xs text-green-600 mt-1">
                                                💵 {formatCurrency(formData.price)} تومان
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className={labelClass}>ظرفیت کل *</label>
                                        <input
                                            type="number"
                                            name="totalCapacity"
                                            value={formData.totalCapacity}
                                            onChange={handleInputChange}
                                            className={inputClass}
                                            placeholder="20"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>درصد تخفیف</label>
                                        <input
                                            type="number"
                                            name="discount.percentage"
                                            value={formData.discount.percentage}
                                            onChange={handleInputChange}
                                            className={inputClass}
                                            placeholder="0"
                                            min="0"
                                            max="100"
                                        />
                                        {formData.discount.percentage > 0 && formData.price && (
                                            <p className="text-xs text-orange-600 mt-1">
                                                🎁 قیمت با تخفیف: {formatCurrency(
                                                Math.floor(parseCurrency(formData.price) * (1 - formData.discount.percentage / 100))
                                            )} تومان
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClass}>نوع تور</label>
                                            <select
                                                name="tourType"
                                                value={formData.tourType}
                                                onChange={handleInputChange}
                                                className={selectClass}
                                            >
                                                <option value="داخلی">داخلی</option>
                                                <option value="خارجی">خارجی</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClass}>نوع حمل و نقل</label>
                                            <select
                                                name="transportation"
                                                value={formData.transportation}
                                                onChange={handleInputChange}
                                                className={selectClass}
                                            >
                                                <option value="اتوبوس">اتوبوس</option>
                                                <option value="هواپیما">هواپیما</option>
                                                <option value="قطار">قطار</option>
                                                <option value="کشتی">کشتی</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                                <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-purple-500 pb-2">
                                    📅 تاریخ و مدت
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>تاریخ شروع و پایان *</label>
                                        <DatePicker
                                            range
                                            calendar={persian}
                                            locale={persian_fa}
                                            value={
                                                formData.startDate && formData.endDate
                                                    ? [new Date(formData.startDate), new Date(formData.endDate)]
                                                    : []
                                            }
                                            onChange={handleDateChange}
                                            className="w-full"
                                            inputClass={inputClass}
                                            placeholder="انتخاب بازه تاریخ"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>مدت تور (روز)</label>
                                        <input
                                            type="text"
                                            value={formData.duration > 0 ? `${formData.duration} روز` : 'ابتدا تاریخ را انتخاب کنید'}
                                            readOnly
                                            className="w-full px-4 py-2.5 bg-white opacity-30 border border-gray-300 rounded-lg text-gray-700 font-semibold cursor-not-allowed text-center"
                                        />
                                        <p className="text-xs text-blue-600 mt-1 text-center">
                                            💡 محاسبه خودکار از بازه تاریخ
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 bg-yellow-50 p-6 rounded-xl">
                                <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-yellow-500 pb-2">
                                    🏨 اقامتگاه
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>نوع اقامتگاه</label>
                                        <select
                                            name="accommodation.type"
                                            value={formData.accommodation.type}
                                            onChange={handleInputChange}
                                            className={selectClass}
                                        >
                                            <option value="">انتخاب کنید</option>
                                            <option value="هتل">هتل</option>
                                            <option value="اپارتمان">اپارتمان</option>
                                            <option value="ویلا">ویلا</option>
                                            <option value="هتل آپارتمان">هتل آپارتمان</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>نام هتل/اقامتگاه</label>
                                        <input
                                            type="text"
                                            name="accommodation.hotelName"
                                            value={formData.accommodation.hotelName}
                                            onChange={handleInputChange}
                                            className={inputClass}
                                            placeholder="هتل گرند سوکومویت"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>تعداد ستاره</label>
                                        <select
                                            name="accommodation.stars"
                                            value={formData.accommodation.stars}
                                            onChange={handleInputChange}
                                            className={selectClass}
                                        >
                                            {[0, 1, 2, 3, 4, 5].map(num => (
                                                <option key={num} value={num}>
                                                    {num === 0 ? 'بدون ستاره' : `${num} ستاره`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>نوع اتاق</label>
                                        <input
                                            type="text"
                                            name="accommodation.roomType"
                                            value={formData.accommodation.roomType}
                                            onChange={handleInputChange}
                                            className={inputClass}
                                            placeholder="دو تخته استاندارد"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 bg-orange-50 p-6 rounded-xl">
                                <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-orange-500 pb-2">
                                    🍽️ وعده‌های غذایی
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <label
                                        className="flex items-center space-x-3 space-x-reverse bg-white p-4 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors">
                                        <input
                                            type="checkbox"
                                            name="meals.breakfast"
                                            checked={formData.meals.breakfast}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                                        />
                                        <span className="font-medium">🌅 صبحانه</span>
                                    </label>
                                    <label
                                        className="flex items-center space-x-3 space-x-reverse bg-white p-4 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors">
                                        <input
                                            type="checkbox"
                                            name="meals.lunch"
                                            checked={formData.meals.lunch}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                                        />
                                        <span className="font-medium">☀️ ناهار</span>
                                    </label>
                                    <label
                                        className="flex items-center space-x-3 space-x-reverse bg-white p-4 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors">
                                        <input
                                            type="checkbox"
                                            name="meals.dinner"
                                            checked={formData.meals.dinner}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                                        />
                                        <span className="font-medium">🌙 شام</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-4 bg-indigo-50 p-6 rounded-xl">
                                <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-indigo-500 pb-2">
                                    👨‍🏫 راهنمای تور
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>نام راهنما</label>
                                        <input
                                            type="text"
                                            name="tourGuide.name"
                                            value={formData.tourGuide.name}
                                            onChange={handleInputChange}
                                            className={inputClass}
                                            placeholder="علی احمدی"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>شماره تماس</label>
                                        <input
                                            type="text"
                                            name="tourGuide.phone"
                                            value={formData.tourGuide.phone}
                                            onChange={handleInputChange}
                                            className={inputClass}
                                            placeholder="09123456789"
                                        />
                                    </div>
                                    <div className="lg:col-span-2">
                                        <label className={labelClass}>بیوگرافی راهنما</label>
                                        <textarea
                                            name="tourGuide.bio"
                                            value={formData.tourGuide.bio}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className={textareaClass}
                                            placeholder="راهنمای تور با سابقه..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-cyan-500 pb-2">
                                    ✨ امکانات
                                </h3>
                                <div className="flex space-x-2 space-x-reverse">
                                    <input
                                        type="text"
                                        value={newFacility}
                                        onChange={(e) => setNewFacility(e.target.value)}
                                        className={inputClass}
                                        placeholder="بلیط پرواز رفت و برگشت"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
                                    />
                                    <button
                                        type="button"
                                        onClick={addFacility}
                                        className="px-6 py-2.5 bg-gradient-to-r bg-primary from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium transition-all shadow-md hover:shadow-lg"
                                    >
                                        افزودن
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.facilities.map((facility, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-blue-100 text-blue-800 font-medium shadow-sm"
                                        >
                                            {facility}
                                            <button
                                                type="button"
                                                onClick={() => removeFacility(index)}
                                                className="mr-2 text-blue-600 hover:text-blue-800 font-bold text-lg"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 bg-green-50 p-6 rounded-xl">
                                <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-green-500 pb-2">
                                    🗺️ برنامه سفر (روز به روز)
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                    <input
                                        type="text"
                                        value={newDay.day}
                                        onChange={(e) => setNewDay({...newDay, day: e.target.value})}
                                        className={`${inputClass} lg:col-span-2`}
                                        placeholder="روز 1"
                                    />
                                    <input
                                        type="text"
                                        value={newDay.title}
                                        onChange={(e) => setNewDay({...newDay, title: e.target.value})}
                                        className={`${inputClass} lg:col-span-4`}
                                        placeholder="عنوان برنامه"
                                    />
                                    <input
                                        type="text"
                                        value={newDay.description}
                                        onChange={(e) => setNewDay({...newDay, description: e.target.value})}
                                        className={`${inputClass} lg:col-span-5`}
                                        placeholder="توضیحات"
                                    />
                                    <button
                                        type="button"
                                        onClick={addItineraryDay}
                                        className="lg:col-span-1 px-4 py-2.5 bg-gradient-to-r bg-primary from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 font-medium transition-all shadow-md hover:shadow-lg"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.itinerary.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-start p-4 bg-white rounded-lg shadow-sm border border-green-200"
                                        >
                                            <div>
                                                <h4 className="font-bold text-green-700">{item.day}: {item.title}</h4>
                                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeItineraryDay(index)}
                                                className="text-green-600 hover:text-green-800 font-bold text-lg"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 bg-red-50 p-6 rounded-xl">
                                <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-red-500 pb-2">
                                    📋 قوانین و مقررات
                                </h3>
                                <div className="flex space-x-2 space-x-reverse">
                                    <input
                                        type="text"
                                        value={newRule}
                                        onChange={(e) => setNewRule(e.target.value)}
                                        className={inputClass}
                                        placeholder="گذرنامه باید حداقل 6 ماه اعتبار داشته باشد"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRule())}
                                    />
                                    <button
                                        type="button"
                                        onClick={addRule}
                                        className="px-6 py-2.5 bg-gradient-to-r bg-primary from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 font-medium transition-all shadow-md hover:shadow-lg"
                                    >
                                        افزودن
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.rules.map((rule, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border border-orange-200"
                                        >
                                            <span className="text-sm text-gray-700">{rule}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeRule(index)}
                                                className="text-orange-600 hover:text-orange-800 font-bold text-lg"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-pink-500 pb-2">
                                    📝 سیاست لغو
                                </h3>
                                <textarea
                                    name="cancellationPolicy"
                                    value={formData.cancellationPolicy}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className={textareaClass}
                                    placeholder="تا 30 روز قبل: 90% بازگشت وجه - 15-30 روز: 50% - 7-15 روز: 30% - کمتر از 7 روز: عدم بازگشت وجه"
                                />
                            </div>

                            <div className="space-y-4 bg-purple-50 p-6 rounded-xl">
                                <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-purple-500 pb-2">
                                    📷 تصاویر
                                </h3>

                                <div>
                                    <label className={labelClass}>لینک تصویر کاور *</label>
                                    <input
                                        type="text"
                                        name="coverImage"
                                        value={formData.coverImage}
                                        onChange={handleInputChange}
                                        className={inputClass}
                                        placeholder="https://example.com/cover-image.jpg"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>افزودن لینک تصویر</label>
                                    <div className="flex space-x-2 space-x-reverse">
                                        <input
                                            type="text"
                                            value={newImageUrl}
                                            onChange={(e) => setNewImageUrl(e.target.value)}
                                            className={inputClass}
                                            placeholder="https://example.com/image.jpg"
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                                        />
                                        <button
                                            type="button"
                                            onClick={addImageUrl}
                                            className="px-6 py-2.5 bg-gradient-to-r bg-primary from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 font-medium transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                                        >
                                            افزودن
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        💡 لینک URL باید با http یا https شروع شود
                                    </p>
                                </div>

                                {formData.images.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                                            تصاویر اضافه شده: ({formData.images.length})
                                        </h4>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            {formData.images.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={image}
                                                        alt={`تصویر ${index + 1}`}
                                                        className="w-full h-32 object-cover rounded-lg shadow-md"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/300x200?text=Invalid+Image';
                                                        }}
                                                    />
                                                    <div
                                                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow-lg hover:bg-red-600 transition-all"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 bg-teal-50 p-6 rounded-xl">
                                <h3 className="text-xl font-semibold text-gray-700 border-b-2 border-teal-500 pb-2">
                                    ⚙️ تنظیمات
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <label
                                        className="flex items-center space-x-3 space-x-reverse bg-white p-4 rounded-lg cursor-pointer hover:bg-teal-100 transition-colors">
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            checked={formData.featured}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                                        />
                                        <span className="font-medium">⭐ تور ویژه</span>
                                    </label>
                                    <label
                                        className="flex items-center space-x-3 space-x-reverse bg-white p-4 rounded-lg cursor-pointer hover:bg-teal-100 transition-colors">
                                        <input
                                            type="checkbox"
                                            name="isSpecialOffer"
                                            checked={formData.isSpecialOffer}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                                        />
                                        <span className="font-medium">🎁 پیشنهاد ویژه</span>
                                    </label>
                                    <div>
                                        <label className={labelClass}>وضعیت</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className={selectClass}
                                        >
                                            <option value="active">✅ فعال</option>
                                            <option value="inactive">❌ غیرفعال</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`px-12 py-4 bg-gradient-to-r bg-primary from-green-500 to-emerald-600 text-white text-lg font-bold rounded-xl transform transition-all shadow-xl ${
                                        loading
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:from-green-600 hover:to-emerald-700 hover:scale-105 hover:shadow-2xl'
                                    }`}
                                >
                                    {loading ? '⏳ در حال ارسال...' : '✅ ایجاد تور'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
