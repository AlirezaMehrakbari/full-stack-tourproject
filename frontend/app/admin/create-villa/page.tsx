"use client";

import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
    FiHome,
    FiMapPin,
    FiDollarSign,
    FiUsers,
    FiImage,
    FiList,
    FiAlertCircle,
    FiCheckCircle
} from 'react-icons/fi';
import {tripTourApi} from "@/axios-instances";

// Types
interface VillaFormData {
    title: string;
    description: string;
    pricePerNight: number;
    capacity: number;
    province: string;
    city: string;
    address: string;
    numRooms: number;
    numBeds: number;
    numBathrooms: number;
    area: number;
    facilities: string[];
    rules: string[];
    suitableFor: string;
    images: string[];
    coverImage: string;
    cancellationPolicy: string;
}

interface User {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    description: string;
}

// Custom Hooks
const useProfile = () => {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const response = await tripTourApi.get('/users/profile');
            return response.data.user as User;
        }
    });
};

const useCreateVilla = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: async (data: VillaFormData) => {
            const response = await tripTourApi.post('/villas', data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('ویلا با موفقیت ایجاد شد! 🎉');
            setTimeout(() => {
                router.push('/owner/my-villas');
            }, 2000);
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'خطا در ایجاد ویلا';
            toast.error(message);
        }
    });
};

// Main Component
const CreateVillaPage = () => {
    const { data: user, isLoading: isLoadingProfile } = useProfile();
    const { mutate: createVilla, isPending: isCreating } = useCreateVilla();

    const [formData, setFormData] = useState<VillaFormData>({
        title: '',
        description: '',
        pricePerNight: 0,
        capacity: 1,
        province: '',
        city: '',
        address: '',
        numRooms: 1,
        numBeds: 1,
        numBathrooms: 1,
        area: 0,
        facilities: [],
        rules: [],
        suitableFor: 'همه',
        images: [],
        coverImage: '',
        cancellationPolicy: 'لغو رزرو تا 7 روز قبل از تاریخ ورود، بدون جریمه'
    });

    const [newFacility, setNewFacility] = useState('');
    const [newRule, setNewRule] = useState('');
    const [newImage, setNewImage] = useState('');

    // مدیریت تغییرات Input
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNumberChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    // مدیریت امکانات
    const addFacility = () => {
        if (newFacility.trim()) {
            setFormData(prev => ({
                ...prev,
                facilities: [...prev.facilities, newFacility.trim()]
            }));
            setNewFacility('');
        }
    };

    const removeFacility = (index: number) => {
        setFormData(prev => ({
            ...prev,
            facilities: prev.facilities.filter((_, i) => i !== index)
        }));
    };

    // مدیریت قوانین
    const addRule = () => {
        if (newRule.trim()) {
            setFormData(prev => ({
                ...prev,
                rules: [...prev.rules, newRule.trim()]
            }));
            setNewRule('');
        }
    };

    const removeRule = (index: number) => {
        setFormData(prev => ({
            ...prev,
            rules: prev.rules.filter((_, i) => i !== index)
        }));
    };

    // مدیریت تصاویر
    const addImage = () => {
        if (newImage.trim()) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, newImage.trim()]
            }));
            setNewImage('');
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    // ارسال فرم
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // اعتبارسنجی
        if (!user?.firstName || !user?.lastName) {
            toast.error('لطفاً ابتدا نام و نام خانوادگی خود را در پروفایل تکمیل کنید');
            return;
        }

        if (!formData.title || !formData.description || !formData.province || !formData.city || !formData.address) {
            toast.error('لطفاً تمام فیلدهای ضروری را پر کنید');
            return;
        }

        if (formData.pricePerNight <= 0) {
            toast.error('قیمت باید بیشتر از صفر باشد');
            return;
        }

        createVilla(formData);
    };

    // نمایش Loading
    if (isLoadingProfile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">در حال بارگذاری...</p>
                </div>
            </div>
        );
    }

    // استایل‌های مشترک
    const inputClass = "w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all";
    const textareaClass = "w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all resize-none";
    const selectClass = "w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all cursor-pointer";
    const labelClass = "flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2";

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* هدر */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">
                                🏡 افزودن ویلای جدید
                            </h1>
                            <p className="text-gray-600">
                                ویلای خود را معرفی کنید و به گردشگران اجاره دهید
                            </p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-xl text-center">
                            <p className="text-sm opacity-90">مالک</p>
                            <p className="font-bold text-lg">
                                {user?.firstName} {user?.lastName}
                            </p>
                        </div>
                    </div>
                </div>

                {/* فرم */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* اطلاعات اصلی */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-blue-500 flex items-center gap-2">
                            <FiHome className="text-blue-600" />
                            اطلاعات اصلی
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* عنوان */}
                            <div className="md:col-span-2">
                                <label className={labelClass}>
                                    <FiHome />
                                    عنوان ویلا *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                    placeholder="مثال: ویلا لوکس ساحلی در شمال"
                                    required
                                />
                            </div>

                            {/* توضیحات */}
                            <div className="md:col-span-2">
                                <label className={labelClass}>
                                    <FiList />
                                    توضیحات کامل *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={5}
                                    className={textareaClass}
                                    placeholder="توضیحات کامل درباره ویلا، امکانات، محیط اطراف و..."
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* موقعیت مکانی */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-green-500 flex items-center gap-2">
                            <FiMapPin className="text-green-600" />
                            موقعیت مکانی
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* استان */}
                            <div>
                                <label className={labelClass}>
                                    <FiMapPin />
                                    استان *
                                </label>
                                <input
                                    type="text"
                                    name="province"
                                    value={formData.province}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                    placeholder="مثال: مازندران"
                                    required
                                />
                            </div>

                            {/* شهر */}
                            <div>
                                <label className={labelClass}>
                                    <FiMapPin />
                                    شهر *
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                    placeholder="مثال: چالوس"
                                    required
                                />
                            </div>

                            {/* آدرس */}
                            <div className="md:col-span-2">
                                <label className={labelClass}>
                                    <FiMapPin />
                                    آدرس کامل *
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className={textareaClass}
                                    placeholder="آدرس دقیق ویلا..."
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* قیمت و ظرفیت */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-purple-500 flex items-center gap-2">
                            <FiDollarSign className="text-purple-600" />
                            قیمت و ظرفیت
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* قیمت */}
                            <div>
                                <label className={labelClass}>
                                    <FiDollarSign />
                                    قیمت هر شب (تومان) *
                                </label>
                                <input
                                    type="number"
                                    name="pricePerNight"
                                    value={formData.pricePerNight}
                                    onChange={handleNumberChange}
                                    className={inputClass}
                                    placeholder="2000000"
                                    min="0"
                                    required
                                />
                            </div>

                            {/* ظرفیت */}
                            <div>
                                <label className={labelClass}>
                                    <FiUsers />
                                    ظرفیت (نفر) *
                                </label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleNumberChange}
                                    className={inputClass}
                                    placeholder="6"
                                    min="1"
                                    required
                                />
                            </div>

                            {/* مناسب برای */}
                            <div>
                                <label className={labelClass}>
                                    <FiUsers />
                                    مناسب برای
                                </label>
                                <select
                                    name="suitableFor"
                                    value={formData.suitableFor}
                                    onChange={handleInputChange}
                                    className={selectClass}
                                >
                                    <option value="همه">همه</option>
                                    <option value="خانواده">خانواده</option>
                                    <option value="دوستان">دوستان</option>
                                    <option value="تجاری">تجاری</option>
                                </select>
                            </div>

                            {/* تعداد اتاق */}
                            <div>
                                <label className={labelClass}>
                                    🛏️ تعداد اتاق خواب
                                </label>
                                <input
                                    type="number"
                                    name="numRooms"
                                    value={formData.numRooms}
                                    onChange={handleNumberChange}
                                    className={inputClass}
                                    placeholder="3"
                                    min="1"
                                />
                            </div>

                            {/* تعداد تخت */}
                            <div>
                                <label className={labelClass}>
                                    🛏️ تعداد تخت
                                </label>
                                <input
                                    type="number"
                                    name="numBeds"
                                    value={formData.numBeds}
                                    onChange={handleNumberChange}
                                    className={inputClass}
                                    placeholder="4"
                                    min="1"
                                />
                            </div>

                            {/* تعداد سرویس */}
                            <div>
                                <label className={labelClass}>
                                    🚿 تعداد سرویس بهداشتی
                                </label>
                                <input
                                    type="number"
                                    name="numBathrooms"
                                    value={formData.numBathrooms}
                                    onChange={handleNumberChange}
                                    className={inputClass}
                                    placeholder="2"
                                    min="1"
                                />
                            </div>

                            {/* متراژ */}
                            <div className="md:col-span-2 lg:col-span-3">
                                <label className={labelClass}>
                                    📏 متراژ (متر مربع)
                                </label>
                                <input
                                    type="number"
                                    name="area"
                                    value={formData.area}
                                    onChange={handleNumberChange}
                                    className={inputClass}
                                    placeholder="150"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* امکانات */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-cyan-500 flex items-center gap-2">
                            <FiCheckCircle className="text-cyan-600" />
                            امکانات
                        </h2>

                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newFacility}
                                    onChange={(e) => setNewFacility(e.target.value)}
                                    className={inputClass}
                                    placeholder="مثال: استخر اختصاصی"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
                                />
                                <button
                                    type="button"
                                    onClick={addFacility}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-semibold transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
                                >
                                    + افزودن
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {formData.facilities.map((facility, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-blue-100 text-blue-800 font-medium shadow-sm"
                                    >
                                        ✓ {facility}
                                        <button
                                            type="button"
                                            onClick={() => removeFacility(index)}
                                            className="text-blue-600 hover:text-blue-800 font-bold text-lg"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* قوانین */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-orange-500 flex items-center gap-2">
                            <FiAlertCircle className="text-orange-600" />
                            قوانین و مقررات
                        </h2>

                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newRule}
                                    onChange={(e) => setNewRule(e.target.value)}
                                    className={inputClass}
                                    placeholder="مثال: ممنوعیت نگهداری حیوانات خانگی"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRule())}
                                />
                                <button
                                    type="button"
                                    onClick={addRule}
                                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 font-semibold transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
                                >
                                    + افزودن
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {formData.rules.map((rule, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-orange-100 text-orange-800 font-medium shadow-sm"
                                    >
                                        ! {rule}
                                        <button
                                            type="button"
                                            onClick={() => removeRule(index)}
                                            className="text-orange-600 hover:text-orange-800 font-bold text-lg"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* تصاویر */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-pink-500 flex items-center gap-2">
                            <FiImage className="text-pink-600" />
                            تصاویر
                        </h2>

                        {/* تصویر کاور */}
                        <div className="mb-6">
                            <label className={labelClass}>
                                🖼️ تصویر کاور (لینک)
                            </label>
                            <input
                                type="url"
                                name="coverImage"
                                value={formData.coverImage}
                                onChange={handleInputChange}
                                className={inputClass}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        {/* سایر تصاویر */}
                        <div className="space-y-4">
                            <label className={labelClass}>
                                📷 سایر تصاویر (لینک)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    value={newImage}
                                    onChange={(e) => setNewImage(e.target.value)}
                                    className={inputClass}
                                    placeholder="https://example.com/image.jpg"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                                />
                                <button
                                    type="button"
                                    onClick={addImage}
                                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 font-semibold transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
                                >
                                    + افزودن
                                </button>
                            </div>

                            {/* نمایش تصاویر */}
                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                    {formData.images.map((img, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={img}
                                                alt={`Image ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* سیاست لغو */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-red-500">
                            📝 سیاست لغو رزرو
                        </h2>
                        <textarea
                            name="cancellationPolicy"
                            value={formData.cancellationPolicy}
                            onChange={handleInputChange}
                            rows={4}
                            className={textareaClass}
                            placeholder="توضیحات درباره سیاست لغو رزرو..."
                        />
                    </div>

                    {/* دکمه ثبت */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-xl font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isCreating ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                                    در حال ایجاد...
                                </span>
                            ) : (
                                '✅ ثبت ویلا'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateVillaPage;
