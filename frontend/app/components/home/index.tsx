"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from "@/app/components/Layout";
import AppSwiper from "@/app/components/AppSwiper";
import Footer from "@/app/components/footer/footer";
import LandingNavbar from "@/app/components/navbar/LandingNavbar";

// Import hooks


// Icons & Images (static imports)
import VillaPic from '@/public/images/house-2.svg';
import Apartment from '@/public/images/buildings.svg';
import Sahel from '@/public/images/Sahel.svg';
import Hotel from '@/public/images/Hotel.svg';
import Airplane from '@/public/images/airplane-square.svg';
import AutumnPicture from '@/public/images/autumnPicture.png';
import NaturePicture from '@/public/images/NaturePicture.png';
import MountainPicture from '@/public/images/MountainPicture.png';
import YazdPicture from '@/public/images/YazdPicture.png';
import Star from '@/public/icons/Star.svg';
import {useGetPopularDestinations} from "@/app/components/home/_hooks/useGetPopularDestinations";
import {useGetFeaturedVillas} from "@/app/components/home/_hooks/useGetFeaturedVillas";
import {useGetVillasByProvince} from "@/app/components/home/_hooks/useGetVillasByProvince";
import Button from "@/app/components/Button";

export default function Home() {
    const { data: featuredVillas, isLoading: loadingFeatured } = useGetFeaturedVillas();
    const { data: popularDestinations, isLoading: loadingDestinations } = useGetPopularDestinations();
    const { data: discountVillas } = useGetVillasByProvince('مازندران');

    const category = [
        { id: 1, category: 'اقامتگاه', url: '/villa', icon: VillaPic },
        { id: 2, category: "آپارتمان", url: '/', icon: Apartment },
        { id: 4, category: "هتل", url: '/', icon: Hotel },
        { id: 5, category: "خرید تور", url: '/tour', icon: Airplane }
    ];

    return (
        <div className='mx-auto'>
            <LandingNavbar />
            {/* Hero Categories */}
            <div className='lg:mt-[-220px] mt-[-40px] z-10 absolute inset-x-0 sm:w-[500px] md:w-[750px] lg:w-[936px] max-h-[126px] mx-auto'>
                <Layout>
                    {category.map(item => (
                        <Link href={item.url} key={item.id}>
                            <div className='flex flex-col items-center justify-center cursor-pointer'>
                                <Image
                                    className='w-[50%] sm:w-[70%] md:w-[90%] lg:w-full'
                                    src={item.icon}
                                    alt={item.category}
                                />
                                <h3 className='text-white font-kalameh700'>{item.category}</h3>
                            </div>
                        </Link>
                    ))}
                </Layout>
            </div>

            <div className='px-6 md:px-[72px]'>
                {/* Static Nature Pictures Section */}
                <div className='flex max-lg:pt-[120px] pb-20 mx-auto justify-center items-center gap-x-[47px]'>
                    <div className='overflow-hidden rounded-[20px] relative group max-xl:hidden'>
                        <Image src={NaturePicture} alt='Nature' className='max-w-[346px] max-h-[512px] rounded-[20px] group-hover:scale-105 transition cursor-pointer' />
                        <div className='absolute text-white bottom-[37px] right-[28px] z-10 group cursor-pointer'>
                            <p>یه پیشنهاد عالی برای شما</p>
                            <h2 className='font-kalameh700 text-[23px]'>سفربه بهشت ایران</h2>
                        </div>
                        <div className='absolute bg-gradient-to-t from-[#524F4F] to-[#02020200] to-20% inset-0 group cursor-pointer'></div>
                    </div>

                    <div className='flex flex-col gap-y-[40px]'>
                        <div className='overflow-hidden rounded-[20px] relative group w-[300px] mx-auto sm:w-[510px] sm:h-[235px]'>
                            <Image src={MountainPicture} alt='Mountain' className='rounded-[20px] object-cover group-hover:scale-105 transition cursor-pointer' />
                            <div className='absolute text-white bottom-[37px] right-[28px] group cursor-pointer z-10'>
                                <h2 className='font-kalameh700 text-[23px]'>ماجراجویی و هیجان</h2>
                            </div>
                            <div className='absolute bg-gradient-to-t from-[#524F4F] to-[#02020200] to-20% inset-0 group cursor-pointer'></div>
                        </div>

                        <div className='overflow-hidden rounded-[20px] relative group w-[300px] mx-auto sm:w-[510px] sm:h-[235px]'>
                            <Image src={YazdPicture} alt='Yazd' className='rounded-[20px] group-hover:scale-105 transition cursor-pointer' />
                            <div className='absolute text-white bottom-[37px] right-[28px] group cursor-pointer z-10'>
                                <h2 className='font-kalameh700 text-[23px]'>سفر به تاریخ ایران</h2>
                            </div>
                            <div className='absolute bg-gradient-to-t from-[#524F4F] to-[#02020200] to-20% inset-0 group cursor-pointer'></div>
                        </div>
                    </div>

                    <div className='overflow-hidden rounded-[20px] relative group max-xl:hidden'>
                        <Image src={AutumnPicture} alt='Autumn' className='max-w-[346px] max-h-[512px] rounded-[20px] group-hover:scale-105 transition cursor-pointer' />
                        <div className='absolute text-white bottom-[37px] right-[28px] cursor-pointer group z-10'>
                            <p>کجا میخوای بری؟!</p>
                            <h2 className='font-kalameh700 text-[23px]'>اقامت شما با ما</h2>
                        </div>
                        <div className='absolute bg-gradient-to-t from-[#524F4F] to-[#02020200] to-20% inset-0 group cursor-pointer'></div>
                    </div>
                </div>

                {/* Popular Destinations - Dynamic */}
                <div className='pb-20'>
                    <div className='flex justify-between pb-4'>
                        <h1 className='font-kalameh500 text-[12px] sm:text-[26px]'>محبوب ترین مقصد ها</h1>
                        <Link href='/villa' className='text-[#4E69CA] text-[12px] sm:text-[22px]'>
                            مشاهده همه
                        </Link>
                    </div>

                    {loadingDestinations ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                        </div>
                    ) : popularDestinations && popularDestinations.length > 0 ? (
                        <AppSwiper
                            data={popularDestinations.map((dest, idx) => ({
                                id: dest.id,
                                title: `اجاره اقامتگاه در ${dest.city}`,
                                src: dest.image || '/default-destination.jpg'
                            }))}
                        />
                    ) : (
                        <p className="text-center text-gray-500">مقصدی یافت نشد</p>
                    )}
                </div>

                {/* Special Discounts - Dynamic با استفاده از fill */}
                {/* بخش جایگزین: ویلاهای پیشنهادی */}
                <section className='pb-20'>
                    <h1 className='pb-8 text-[26px] font-kalameh500'>💎 پیشنهاد ویژه ما</h1>

                    {featuredVillas && featuredVillas.length > 0 ? (
                        <div className='space-y-6'>
                            {/* کارت بزرگ اول */}
                            <Link href={`/villa/${featuredVillas[0].id}`}>
                                <div className='relative group overflow-hidden rounded-3xl shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-500 h-[500px] cursor-pointer'>
                                    {/* تصویر با کیفیت بهتر */}
                                    <Image
                                        src={featuredVillas[0].coverImage || featuredVillas[0].images?.[0] || '/default-villa.jpg'}
                                        alt={featuredVillas[0].title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                                        quality={90}
                                        priority
                                        className='object-cover group-hover:scale-110 transition-transform duration-700 ease-out'
                                        onError={(e: any) => {
                                            e.currentTarget.src = '/default-villa.jpg';
                                        }}
                                    />

                                    {/* گرادینت بهتر با لایه‌های متعدد */}
                                    <div className='absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500'></div>
                                    <div className='absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30'></div>

                                    {/* محتوا */}
                                    <div className='absolute bottom-0 right-0 left-0 p-6 md:p-10 text-white'>
                                        <div className='max-w-3xl space-y-4'>
                                            {/* بج برتر */}
                                            <div className='inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-5 py-2.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm'>
                                                <span className='text-lg'>⭐</span>
                                                <span>انتخاب برتر</span>
                                            </div>

                                            {/* عنوان */}
                                            <h2 className='text-3xl md:text-4xl lg:text-5xl font-kalameh700 leading-tight drop-shadow-2xl'>
                                                {featuredVillas[0].title}
                                            </h2>

                                            {/* اطلاعات */}
                                            <div className='flex flex-wrap items-center gap-4 md:gap-6 text-base md:text-lg'>
          <span className='flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full'>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
            </svg>
            <span className='font-medium'>{featuredVillas[0].province} • {featuredVillas[0].city}</span>
          </span>

                                                <span className='flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full'>
            <span>👥</span>
            <span className='font-medium'>{featuredVillas[0].capacity} نفر</span>
          </span>

                                                <span className='flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full'>
            <span>🚪</span>
            <span className='font-medium'>{featuredVillas[0].numRooms || 2} اتاق</span>
          </span>
                                            </div>

                                            {/* قیمت و دکمه */}
                                            <div className='flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-4'>
                                                <div className='space-y-1'>
                                                    <p className='text-sm md:text-base text-white/70 font-medium'>قیمت هر شب از:</p>
                                                    <div className='flex items-baseline gap-2'>
                                                        <p className='text-3xl md:text-4xl font-kalameh700 text-yellow-400'>
                                                            {featuredVillas[0].pricePerNight?.toLocaleString('fa-IR')}
                                                        </p>
                                                        <span className='text-lg md:text-xl text-white/90 font-medium'>ریال</span>
                                                    </div>
                                                </div>

                                                <Button
                                                    className='group/btn bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto'
                                                >
            <span className='flex items-center gap-2'>
              مشاهده و رزرو
              <svg className='w-5 h-5 group-hover/btn:translate-x-1 transition-transform' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
            </span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>


                            {/* Grid کوچک زیرش */}
                            <div className='grid md:grid-cols-3 gap-6'>
                                {featuredVillas.slice(1, 4).map((villa: any) => (
                                    <Link href={`/villa/${villa.id}`} key={villa.id}>
                                        <div className='group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden'>
                                            <div className='relative h-48'>
                                                <Image
                                                    src={villa.coverImage || villa.images?.[0] || '/default-villa.jpg'}
                                                    alt={villa.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                    className='object-cover group-hover:scale-110 transition-transform duration-500'
                                                />
                                            </div>

                                            <div className='p-5'>
                                                <h3 className='font-kalameh700 text-lg mb-2 truncate'>{villa.title}</h3>
                                                <p className='text-sm text-gray-600 mb-3'>{villa.province} | {villa.city}</p>

                                                <div className='flex items-center justify-between pt-3 border-t'>
                                                    <span className='text-sm text-gray-500'>هر شب</span>
                                                    <span className='font-bold text-blue-600'>
                    {villa.pricePerNight?.toLocaleString()} ریال
                  </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-2xl p-12 text-center">
                            <div className="text-6xl mb-4">✨</div>
                            <p className="text-xl text-gray-500">در حال بارگذاری پیشنهادات...</p>
                        </div>
                    )}
                </section>


                {/* Suggested Villas - Dynamic */}
                <h1 className='sm:text-[26px] font-kalameh500 py-4'>سـفر بعـدی شما میتـونه ایـنجا باشه !</h1>

                {loadingFeatured ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                    </div>
                ) : featuredVillas && featuredVillas.length > 0 ? (
                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-[214px]'>
                        {featuredVillas.slice(0, 6).map(villa => (
                            <Link href={`/villa/${villa.id}`} key={villa.id}>
                                <div className='flex items-center gap-6 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition'>
                                    {/* تصویر کوچک با سایز مشخص */}
                                    <div className='relative w-[120px] h-[100px] flex-shrink-0'>
                                        <Image
                                            src={villa.coverImage || villa.images?.[0] || '/no-image.jpg'}
                                            alt={villa.title}
                                            fill
                                            sizes="120px"
                                            className='rounded-lg object-cover'
                                            onError={(e: any) => {
                                                e.currentTarget.src = '/no-image.jpg';
                                            }}
                                        />
                                    </div>
                                    <div className='flex flex-col items-start'>
                                        <h2 className='sm:text-[20px] font-kalameh400'>{villa.title}</h2>
                                        <p className='text-[13px] text-[#3C3B3B]'>
                                            میانگین قیمت هر شب {villa.pricePerNight?.toLocaleString()} ریال
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 pb-20">ویلایی یافت نشد</p>
                )}

                {/* Static Payment & Support Info */}
                <div className='grid md:grid-cols-2 sm:pr-12'>
                    <div>
                        <h1 className='pb-[51px] sm:text-[26px] font-kalameh700'>اطمینان از پرداخت</h1>
                        <p className='sm:text-[19.5px]'>
                            از طریق تریپ تور امکان پرداخت از طریق کارت‌های شتاب را دارید.<br />
                            برای پرداخت آنلاین که تنها لازم است روند خرید را پیگیری کنید و<br />
                            به درگاه پرداخت امن انتقال یابید.
                        </p>
                    </div>
                    <div className='max-md:pt-8'>
                        <h1 className='pb-[51px] sm:text-[26px] font-kalameh700'>اطمینان از خدمات پشتیبانی</h1>
                        <p className='sm:text-[17px]'>
                            پس از روند خرید هر مشکلی را می‌توانید از طریق همکاران پشتیبانی ما برطرف کنید.<br />
                            می‌توانید از طریق پنل کاربری خود بر روی رزرو مدنظر درخواست پشتیبانی دهید.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
