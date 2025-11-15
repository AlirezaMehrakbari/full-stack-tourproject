//@ts-nocheck
'use client'
import Navbar from "@/app/components/navbar/Navbar";
import Image from "next/image";
import VillaHomePicture from '@/public/images/VillaHomePicture.png'
import Layout from "@/app/components/Layout";
import SelectDropDown from "@/app/components/dropDown/SelectDropDown";
import React, { useState } from "react";
import VillaList from "@/app/components/villa/VillaList";
import Footer from "@/app/components/footer/footer";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import opacity from "react-element-popper/animations/opacity";
import DatePickerPlugin from "@/app/components/plugin/DatePickerPlugin";
import { useQuery } from "@tanstack/react-query";
import { Skeleton, Box, Alert } from "@mui/material";
import {getVillaList} from "@/app/villa/_api/getVillaList";

// ----------------------------------------------
const VillaHomePage = () => {
    const [destination, setDestination] = useState('');
    const [passengers, setPassengers] = useState(0);
    const [values, setValues] = useState<any[]>([]);
    const [filters, setFilters] = useState<Record<string, any>>({});


    const checkIn = values?.[0]
        ? new DateObject(values[0]).format("YYYY-MM-DD")
        : null;
    const checkOut = values?.[1]
        ? new DateObject(values[1]).format("YYYY-MM-DD")
        : null;

    const provinces = [
        { id: 1, provinceName: 'تهران' },
        { id: 2, provinceName: 'اصفهان' },
        { id: 3, provinceName: 'شیراز' },
        { id: 4, provinceName: 'سمنان' },
        { id: 5, provinceName: 'البرز' },
        { id: 6, provinceName: 'آستارا' },
    ];

    const handleIncreasePassenger = () => setPassengers(prev => prev + 1);
    const handleDecreasePassenger = () => passengers > 0 && setPassengers(prev => prev - 1);

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newFilters: any = {};
        if (destination) newFilters.province = destination;
        if (passengers) newFilters.minCapacity = passengers;
        if (checkIn && checkOut) {
            newFilters.startDate = checkIn;
            newFilters.endDate = checkOut;
        }
        setFilters(newFilters);
    };

    // ⚡ دریافت داده‌ها با React Query
    const { data: villas, isLoading, isError } = useQuery({
        queryKey: ['villas', filters],
        queryFn: () => getVillaList(filters),
    });

    return (
        <div>
            <Navbar />
            <section className="w-[80%] mx-auto">
                <div className="pt-[12rem] relative max-xl:pb-[16rem]">
                    <Image
                        className="rounded-[25px] max-h-[564px] object-cover"
                        src={VillaHomePicture}
                        alt="Villa Home Picture"
                    />

                    {/* 🔻 فیلتر فرم */}
                    <div className="w-[90%] mx-auto absolute bottom-0 xl:bottom-[-2rem] inset-x-0">
                        <Layout>
                            <form
                                onSubmit={handleFilterSubmit}
                                className="flex flex-col xl:flex-row justify-between items-center gap-x-8 gap-y-6 w-full"
                            >
                                {/* مقصد */}
                                <div>
                                    <p className="sm:text-[20.6px] font-kalameh700 text-white">کجا میخوای بری؟</p>
                                    <SelectDropDown
                                        main
                                        label={destination || 'مقصد'}
                                        dropDownStyles="absolute bg-[#FFF] top-10 w-full shadow-md rounded-md text-[#000] left-[2px] px-4 py-2"
                                    >
                                        <div className="flex flex-col divide-y divide-[#D3D3D3]">
                                            {provinces.map((p) => (
                                                <div
                                                    key={p.id}
                                                    className="py-2 cursor-pointer"
                                                    onClick={() => setDestination(p.provinceName)}
                                                >
                                                    {p.provinceName}
                                                </div>
                                            ))}
                                        </div>
                                    </SelectDropDown>
                                </div>

                                {/* تاریخ */}
                                <div>
                                    <p className="sm:text-[20.6px] font-kalameh700 text-white">کی میخوای بری؟</p>
                                    <DatePicker
                                        plugins={[<DatePickerPlugin entryDate={checkIn} exitDate={checkOut} position="top" />]}
                                        dateSeparator=" تا "
                                        animations={[opacity()]}
                                        inputClass="cursor-pointer w-full bg-transparent text-white border-b-[1px] rounded-md outline-none placeholder:text-white text-[14px] font-kalameh400 px-2"
                                        minDate={new DateObject()}
                                        placeholder="تاریخ سفر را مشخص کنید"
                                        value={values}
                                        onChange={setValues}
                                        range
                                        fixMainPosition={true}
                                        calendar={persian}
                                        locale={persian_fa}
                                        calendarPosition="bottom"
                                    />
                                </div>

                                {/* تعداد نفرات */}
                                <div>
                                    <p className="sm:text-[20.6px] font-kalameh700 text-white">چند نفر؟</p>
                                    <SelectDropDown
                                        main
                                        isCounter
                                        label={passengers > 0 ? `${passengers} مسافر` : 'تعداد مسافران'}
                                        dropDownStyles="absolute bg-[#FFF] top-10 md:w-[300px] inset-x-0 rounded-md text-[#000] mx-auto shadow-md px-4 py-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="font-kalameh400">تعداد نفرات</p>
                                            <div className="flex items-center justify-between w-[80px]">
                                                <button type="button" onClick={handleIncreasePassenger} className="w-[24px] h-[24px] bg-[#1270B0] rounded-full text-white">+</button>
                                                <span className="px-2">{passengers}</span>
                                                <button type="button" onClick={handleDecreasePassenger} className="w-[24px] h-[24px] border-[2px] border-[#1270B0] rounded-full">-</button>
                                            </div>
                                        </div>
                                    </SelectDropDown>
                                </div>

                                {/* دکمه */}
                                <button className="text-[22px] font-kalameh500 bg-[#83734E] text-white px-8 py-2 rounded-full">
                                    فیلتر
                                </button>
                            </form>
                        </Layout>
                    </div>
                </div>

                {/* 🔻 لیست ویلاها */}
                <h1 className="text-[32px] font-kalameh700 pt-[110px] pb-10">اجاره ویلا در سراسر کشور</h1>

                {isLoading && (
                    <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={2}>
                        {Array.from({ length: 12 }).map((_, i) => (
                            <Skeleton key={i} variant="rectangular" width="100%" height={220} sx={{ borderRadius: '12px' }} />
                        ))}
                    </Box>
                )}

                {isError && <Alert severity="error">خطا در دریافت ویلاها! لطفاً دوباره تلاش کنید.</Alert>}

                {!isLoading && !isError && villas && <VillaList data={villas} />}

            </section>

            <Footer />
        </div>
    );
};

export default VillaHomePage;
