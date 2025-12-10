"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiSave, FiX, FiTrash2, FiUser, FiPhone, FiMail, FiMapPin, FiCalendar, FiCreditCard } from 'react-icons/fi';
import {tripTourApi} from "@/axios-instances";
import Button from "@/app/components/Button";

// Types
interface User {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    nationalId: string;
    birthDate: string;
    city: string;
    profileImage: string;
    description: string;
    role: string;
    createdAt: string;
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

const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<User>) => {
            const response = await tripTourApi.put('/users/profile', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            toast.success('پروفایل با موفقیت به‌روزرسانی شد');
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'خطا در به‌روزرسانی پروفایل';
            toast.error(message);
        }
    });
};

const useDeleteProfileImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await tripTourApi.delete('/users/profile/image');
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            toast.success('عکس پروفایل حذف شد');
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'خطا در حذف عکس';
            toast.error(message);
        }
    });
};

// Main Component
const OwnerProfilePage = () => {
    const { data: user, isLoading: isPending } = useProfile();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
    const { mutate: deleteImage, isPending: isDeleting } = useDeleteProfileImage();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>({});

    // مقداردهی اولیه فرم هنگام ویرایش
    React.useEffect(() => {
        if (isEditing && user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                nationalId: user.nationalId || '',
                birthDate: user.birthDate || '',
                city: user.city || '',
                profileImage: user.profileImage || '',
                description: user.description || ''
            });
        }
    }, [isEditing, user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        if (!formData.firstName || !formData.lastName) {
            toast.error('نام و نام خانوادگی الزامی است');
            return;
        }

        updateProfile(formData, {
            onSuccess: () => {
                setIsEditing(false);
            }
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({});
    };

    const handleDeleteImage = () => {
        if (window.confirm('آیا از حذف عکس پروفایل مطمئن هستید؟')) {
            deleteImage();
        }
    };

    if (isPending) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">در حال بارگذاری...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
                    <p className="text-red-600 text-lg mb-4">❌ خطا در بارگذاری اطلاعات</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        تلاش مجدد
                    </Button>
                </div>
            </div>
        );
    }

    // استایل‌های مشترک
    const inputClass = "w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all";
    const textareaClass = "w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all resize-none";
    const labelClass = "flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2";
    const readOnlyClass = "w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700";

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
            <div className="max-w-5xl mx-auto px-4">
                {/* هدر */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            {/* عکس پروفایل */}
                            <div className="relative group">
                                {user.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt="Profile"
                                        className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                                    />
                                ) : (
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
                                        <FiUser className="text-white text-5xl" />
                                    </div>
                                )}
                                {isEditing && user.profileImage && (
                                    <Button
                                        onClick={handleDeleteImage}
                                        disabled={isDeleting}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50"
                                        title="حذف عکس"
                                    >
                                        <FiTrash2 className="text-sm" />
                                    </Button>
                                )}
                            </div>

                            {/* اطلاعات اصلی */}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                    {user.firstName} {user.lastName}
                                </h1>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <FiPhone className="text-blue-600" />
                                        {user.phoneNumber}
                                    </span>
                                    {user.email && (
                                        <span className="flex items-center gap-1">
                                            <FiMail className="text-blue-600" />
                                            {user.email}
                                        </span>
                                    )}
                                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xs font-semibold">
                                        {user.role === 'owner' ? '🏠 مالک' : '👤 کاربر'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* دکمه‌های عملیات */}
                        <div className="flex gap-3">
                            {!isEditing ? (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    <FiEdit2 />
                                    ویرایش پروفایل
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        onClick={handleSave}
                                        disabled={isUpdating}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50"
                                    >
                                        <FiSave />
                                        {isUpdating ? 'در حال ذخیره...' : 'ذخیره'}
                                    </Button>
                                    <Button
                                        onClick={handleCancel}
                                        disabled={isUpdating}
                                        className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50"
                                    >
                                        <FiX />
                                        انصراف
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* فرم اطلاعات */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-gray-200">
                        📋 اطلاعات شخصی
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* نام */}
                        <div>
                            <label className={labelClass}>
                                <FiUser className="text-blue-600" />
                                نام *
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName || ''}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                    placeholder="نام خود را وارد کنید"
                                    required
                                />
                            ) : (
                                <div className={readOnlyClass}>{user.firstName}</div>
                            )}
                        </div>

                        {/* نام خانوادگی */}
                        <div>
                            <label className={labelClass}>
                                <FiUser className="text-blue-600" />
                                نام خانوادگی *
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName || ''}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                    placeholder="نام خانوادگی خود را وارد کنید"
                                    required
                                />
                            ) : (
                                <div className={readOnlyClass}>{user.lastName}</div>
                            )}
                        </div>

                        {/* کد ملی */}
                        <div>
                            <label className={labelClass}>
                                <FiCreditCard className="text-blue-600" />
                                کد ملی
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="nationalId"
                                    value={formData.nationalId || ''}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                    placeholder="کد ملی 10 رقمی"
                                    maxLength={10}
                                />
                            ) : (
                                <div className={readOnlyClass}>
                                    {user.nationalId || 'وارد نشده'}
                                </div>
                            )}
                        </div>

                        {/* تاریخ تولد */}
                        <div>
                            <label className={labelClass}>
                                <FiCalendar className="text-blue-600" />
                                تاریخ تولد
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="birthDate"
                                    value={formData.birthDate || ''}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                    placeholder="مثال: 1370/01/01"
                                />
                            ) : (
                                <div className={readOnlyClass}>
                                    {user.birthDate || 'وارد نشده'}
                                </div>
                            )}
                        </div>

                        {/* شهر */}
                        <div>
                            <label className={labelClass}>
                                <FiMapPin className="text-blue-600" />
                                شهر
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city || ''}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                    placeholder="نام شهر"
                                />
                            ) : (
                                <div className={readOnlyClass}>
                                    {user.city || 'وارد نشده'}
                                </div>
                            )}
                        </div>

                        {/* ایمیل */}
                        <div>
                            <label className={labelClass}>
                                <FiMail className="text-blue-600" />
                                ایمیل
                            </label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ''}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                    placeholder="example@email.com"
                                />
                            ) : (
                                <div className={readOnlyClass}>
                                    {user.email || 'وارد نشده'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* لینک عکس پروفایل */}
                    {isEditing && (
                        <div className="mt-6">
                            <label className={labelClass}>
                                🖼️ لینک عکس پروفایل
                            </label>
                            <input
                                type="url"
                                name="profileImage"
                                value={formData.profileImage || ''}
                                onChange={handleInputChange}
                                className={inputClass}
                                placeholder="https://example.com/image.jpg"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                💡 لینک مستقیم تصویر را وارد کنید
                            </p>
                        </div>
                    )}

                    {/* درباره من */}
                    <div className="mt-6">
                        <label className={labelClass}>
                            ✍️ درباره من
                        </label>
                        {isEditing ? (
                            <textarea
                                name="description"
                                value={formData.description || ''}
                                onChange={handleInputChange}
                                rows={4}
                                className={textareaClass}
                                placeholder="چند خط درباره خود بنویسید..."
                            />
                        ) : (
                            <div className={`${readOnlyClass} min-h-[100px]`}>
                                {user.description || 'توضیحاتی وارد نشده'}
                            </div>
                        )}
                    </div>

                    {/* اطلاعات سیستمی */}
                    <div className="mt-8 pt-6 border-t-2 border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            🔐 اطلاعات سیستمی
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-sm text-gray-600 mb-1">شماره تلفن</p>
                                <p className="font-semibold text-gray-800">{user.phoneNumber}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-sm text-gray-600 mb-1">تاریخ عضویت</p>
                                <p className="font-semibold text-gray-800">
                                    {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                            ℹ️ شماره تلفن قابل ویرایش نیست و باید از طریق پشتیبانی تغییر یابد
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerProfilePage;
