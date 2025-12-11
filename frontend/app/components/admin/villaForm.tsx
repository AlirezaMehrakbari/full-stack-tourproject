"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import {
    FiHome,
    FiMapPin,
    FiDollarSign,
    FiUsers,
    FiImage,
    FiList,
    FiAlertCircle,
    FiCheckCircle,
    FiX,
    FiPlus
} from 'react-icons/fi';
import Button from "@/app/components/Button";
import {useCreateVilla, useProfile, useUpdateVilla, useVillaDetails} from "@/app/components/admin/_hooks/useVillas";

export interface VillaFormData {
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




const VillaForm = () => {
    const searchParams = useSearchParams();
    const villaId = searchParams?.get("id") as string | undefined;
    const isEditMode = !!villaId;

    const { data: user, isLoading: isLoadingProfile } = useProfile();
    const { data: villaData, isLoading: isLoadingVilla, error: villaError } = useVillaDetails(villaId || null);
    const { mutate: createVilla, isPending: isCreating } = useCreateVilla();
    const { mutate: updateVilla, isPending: isUpdating } = useUpdateVilla(villaId || '');

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

    // پر کردن فرم در حالت ویرایش
    useEffect(() => {
        if (isEditMode && villaData) {
            setFormData({
                title: villaData.title || '',
                description: villaData.description || '',
                pricePerNight: villaData.pricePerNight || 0,
                capacity: villaData.capacity || 1,
                province: villaData.province || '',
                city: villaData.city || '',
                address: villaData.address || '',
                numRooms: villaData.numRooms || 1,
                numBeds: villaData.numBeds || 1,
                numBathrooms: villaData.numBathrooms || 1,
                area: villaData.area || 0,
                facilities: villaData.facilities || [],
                rules: villaData.rules || [],
                suitableFor: villaData.suitableFor || 'همه',
                images: villaData.images || [],
                coverImage: villaData.coverImage || '',
                cancellationPolicy: villaData.cancellationPolicy || 'لغو رزرو تا 7 روز قبل از تاریخ ورود، بدون جریمه'
            });
        }
    }, [isEditMode, villaData]);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

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

        if (isEditMode) {
            updateVilla(formData);
        } else {
            createVilla(formData);
        }
    };

    if (isLoadingProfile || (isEditMode && isLoadingVilla)) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">در حال بارگذاری...</p>
                </div>
            </div>
        );
    }

    if (isEditMode && villaError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="bg-red-50 border-2 border-red-500 rounded-xl p-8 max-w-md text-center">
                    <FiAlertCircle className="text-red-500 text-6xl mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-red-800 mb-2">خطا در بارگذاری ویلا</h2>
                    <p className="text-red-600 mb-4">ویلا یافت نشد یا شما دسترسی ندارید.</p>
                    <Button
                        onClick={() => window.history.back()}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        بازگشت
                    </Button>
                </div>
            </div>
        );
    }

    const inputClass = "w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all";
    const textareaClass = "w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all resize-none";
    const selectClass = "w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all cursor-pointer";
    const labelClass = "flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2";

    const isSubmitting = isCreating || isUpdating;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* هدر */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">
                                {isEditMode ? '✏️ ویرایش ویلا' : '🏡 افزودن ویلای جدید'}
                            </h1>
                            <p className="text-gray-600">
                                {isEditMode
                                    ? 'ویرایش اطلاعات ویلا'
                                    : 'ویلای خود را معرفی کنید و به گردشگران اجاره دهید'
                                }
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

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* اطلاعات اصلی */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-blue-500 flex items-center gap-2">
                            <FiHome className="text-blue-600" />
                            اطلاعات اصلی
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            ✨ امکانات
                        </h2>

                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newFacility}
                                    onChange={(e) => setNewFacility(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
                                    className={inputClass}
                                    placeholder="مثال: استخر، جکوزی، باربیکیو"
                                />
                                <Button
                                    type="button"
                                    onClick={addFacility}
                                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
                                >
                                    <FiPlus />
                                    افزودن
                                </Button>
                            </div>

                            {formData.facilities.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.facilities.map((facility, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 text-cyan-800 rounded-full font-medium"
                                        >
                                            ✓ {facility}
                                            <button
                                                type="button"
                                                onClick={() => removeFacility(index)}
                                                className="text-cyan-600 hover:text-cyan-800 transition-colors"
                                            >
                                                <FiX />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* قوانین */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-orange-500 flex items-center gap-2">
                            📋 قوانین و مقررات
                        </h2>

                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newRule}
                                    onChange={(e) => setNewRule(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRule())}
                                    className={inputClass}
                                    placeholder="مثال: عدم نگهداری حیوانات خانگی"
                                />
                                <Button
                                    type="button"
                                    onClick={addRule}
                                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
                                >
                                    <FiPlus />
                                    افزودن
                                </Button>
                            </div>

                            {formData.rules.length > 0 && (
                                <div className="space-y-2">
                                    {formData.rules.map((rule, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200"
                                        >
                                            <span className="text-gray-700">• {rule}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeRule(index)}
                                                className="text-orange-600 hover:text-orange-800 transition-colors"
                                            >
                                                <FiX size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* تصاویر */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-pink-500 flex items-center gap-2">
                            <FiImage className="text-pink-600" />
                            تصاویر
                        </h2>

                        <div className="space-y-6">
                            {/* تصویر کاور */}
                            <div>
                                <label className={labelClass}>
                                    🖼️ تصویر کاور (اصلی)
                                </label>
                                <input
                                    type="text"
                                    name="coverImage"
                                    value={formData.coverImage}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                    placeholder="https://example.com/image.jpg"
                                />
                                {formData.coverImage && (
                                    <div className="mt-4">
                                        <img
                                            src={formData.coverImage}
                                            alt="Cover"
                                            className="w-full h-64 object-cover rounded-xl shadow-lg"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* سایر تصاویر */}
                            <div>
                                <label className={labelClass}>
                                    🖼️ سایر تصاویر
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newImage}
                                        onChange={(e) => setNewImage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                                        className={inputClass}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <Button
                                        type="button"
                                        onClick={addImage}
                                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
                                    >
                                        <FiPlus />
                                        افزودن
                                    </Button>
                                </div>

                                {formData.images.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                                        {formData.images.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={image}
                                                    alt={`Image ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-xl shadow-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                                >
                                                    <FiX />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* سیاست لغو */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-red-500 flex items-center gap-2">
                            📝 سیاست لغو رزرو
                        </h2>

                        <textarea
                            name="cancellationPolicy"
                            value={formData.cancellationPolicy}
                            onChange={handleInputChange}
                            rows={4}
                            className={textareaClass}
                            placeholder="مثال: لغو رزرو تا 7 روز قبل از تاریخ ورود، بدون جریمه..."
                        />
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-xl font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                                    {isEditMode ? 'در حال ویرایش...' : 'در حال ایجاد...'}
                                </span>
                            ) : (
                                isEditMode ? '✅ ذخیره تغییرات' : '✅ ثبت ویلا'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VillaForm;
