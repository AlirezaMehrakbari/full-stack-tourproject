import ReceiptPicture from '@/public/images/ReceiptPicture.png'
import Image from "next/image";
import Stepper from "@/app/components/Stepper";
import React from "react";
import {useAppSelector} from "@/app/redux/store";
import formatCurrency from "@/app/utils/FormatCurrency";
import {Tour} from "@/app/tour/_types/tourTypes";
import moment from "jalali-moment";
import Link from "next/link";

type ReceiptProps = {
    isVilla?: boolean,
    villaDetails?: VillaDetails,
    tourDetails?: Tour
}

const Receipt: React.FC<ReceiptProps> = ({isVilla, villaDetails, tourDetails}) => {
    const userSession = useAppSelector(state => state.userSlice);
    const villaReserveDetail = useAppSelector(state => state.villaReserve);
    const tourReserveDetail = useAppSelector(state => state.tourReserve);

    const totalTourPassengers = tourReserveDetail.passengers.adult1 +
        tourReserveDetail.passengers.adult2 +
        tourReserveDetail.passengers.childFrom2to12 +
        tourReserveDetail.passengers.child2;

    const calculateTotalPrice = () => {
        if (isVilla) {
            return (villaDetails?.pricePerNight || 0);
        } else {
            return (tourDetails?.price || 0) * totalTourPassengers;
        }
    };

    const shamsiStartDate = tourDetails?.startDate
        ? moment(tourDetails.startDate, 'YYYY-MM-DD').locale('fa').format('jD jMMMM')
        : '';
    const shamsiEndDate = tourDetails?.endDate
        ? moment(tourDetails.endDate, 'YYYY-MM-DD').locale('fa').format('jD jMMMM')
        : '';

    const getDuration = () => {
        if (isVilla) {
            return `${villaReserveDetail.duration.length} شب`;
        } else {
            return `${tourDetails?.duration || 0} روز`;
        }
    };

    return (
        <div className='bg-[#F5F5F5] min-h-screen flex flex-col items-center md:pt-40'>
            <Stepper isVilla={isVilla}/>
            <div className='w-full flex flex-col sm:w-[90%] md:w-[80%]'>
                <div className='bg-white rounded-[10px] py-8 shadow-md'>
                    <div className='relative w-[60%] sm:w-[80%] mx-auto h-[200px] sm:h-[250px]'>
                        <Image
                            className='rounded-2xl object-cover'
                            src={
                                isVilla
                                    ? villaDetails?.medias[0] || ReceiptPicture
                                    : tourDetails?.images?.[0] || ReceiptPicture
                            }
                            alt={'Receipt Picture'}
                            fill
                        />
                        <div
                            className='absolute bg-[#1F2D80] text-white text-[12px] sm:text-[27.8px] font-kalameh500 rounded-[82px] py-2 px-4 border-t-[2px] border-white bottom-[-18px] inset-x-0 w-fit mx-auto'>
                            {isVilla ? (
                                <p>
                                    رزرو شما با <span className='text-orange font-kalameh700'>موفقیت</span> ثبت شــد
                                </p>
                            ) : (
                                <p>
                                    تــور شما با <span className='text-orange font-kalameh700'>موفقیت</span> خریداری شــد
                                </p>
                            )}
                        </div>
                    </div>

                    <div className='flex flex-col sm:flex-row items-start justify-between gap-y-4 pt-[54px] px-8'>
                        <div className='flex flex-col gap-y-2'>
                            <div className='sm:text-[25.5px] flex items-center gap-x-2'>
                                <p className='text-[#777575]'>به نام:</p>
                                <p>{userSession.value.fullName}</p>
                            </div>
                            <div className='sm:text-[25.5px] flex items-center gap-x-2'>
                                <p className='text-[#777575]'>
                                    {isVilla ? 'مدت اقامت:' : 'مدت تور:'}
                                </p>
                                <p>{getDuration()}</p>
                            </div>
                            <div className='sm:text-[25.5px] flex items-center gap-x-2'>
                                <p className='text-[#777575]'>مبلغ پرداختی:</p>
                                <p>{formatCurrency(+calculateTotalPrice())} تومان</p>
                            </div>
                        </div>

                        <div className='flex flex-col gap-y-2'>
                            <div className='sm:text-[25.5px] flex items-center gap-x-2'>
                                <p className='text-[#777575]'>تاریخ رفت:</p>
                                {isVilla ? (
                                    <p>
                                        {/*@ts-ignore*/}
                                        {villaReserveDetail?.entryDate?.day} {villaReserveDetail?.entryDate?.month?.name} ماه
                                    </p>
                                ) : (
                                    <p>{shamsiStartDate}</p>
                                )}
                            </div>
                            <div className='sm:text-[25.5px] flex items-center gap-x-2'>
                                <p className='text-[#777575]'>تاریخ برگشت:</p>
                                {isVilla ? (
                                    <p>
                                        {/*@ts-ignore*/}
                                        {villaReserveDetail?.exitDate?.day} {villaReserveDetail?.exitDate?.month?.name} ماه
                                    </p>
                                ) : (
                                    <p>{shamsiEndDate}</p>
                                )}
                            </div>
                            <div className='sm:text-[25.5px] flex items-center gap-x-2'>
                                <p className='text-[#777575]'>تعداد مسافران:</p>
                                <p>
                                    {isVilla ? villaReserveDetail.passengers : totalTourPassengers} نفر
                                </p>
                            </div>
                        </div>
                    </div>

                    {!isVilla && tourReserveDetail.passengersInfo.length > 0 && (
                        <div className='mt-8 px-8 border-t pt-6'>
                            <h3 className='text-[20px] sm:text-[25.5px] font-kalameh500 mb-4'>
                                مشخصات مسافران:
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                {tourReserveDetail.passengersInfo.map((passenger, index) => (
                                    <div key={passenger.id} className='bg-[#F9F9F9] p-4 rounded-lg'>
                                        <p className='text-[16px] sm:text-[20px] font-kalameh500 mb-2'>
                                            مسافر {index + 1}
                                        </p>
                                        <p className='text-[14px] sm:text-[18px]'>
                                            {passenger.firstName} {passenger.lastName}
                                        </p>
                                        <p className='text-[12px] sm:text-[16px] text-[#777575]'>
                                            کد ملی: {passenger.nationalId}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* دکمه‌های بازگشت */}
                    <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 px-8'>
                        <Link
                            href='/profile'
                            className='w-full sm:w-auto bg-[#1F2D80] hover:bg-[#152159] text-white font-kalameh500 text-[16px] sm:text-[20px] py-3 px-8 rounded-lg transition-colors duration-200 text-center'
                        >
                            حساب کاربری
                        </Link>
                        <Link
                            href='/'
                            className='w-full sm:w-auto bg-orange hover:bg-[#ff8c42] text-white font-kalameh500 text-[16px] sm:text-[20px] py-3 px-8 rounded-lg transition-colors duration-200 text-center'
                        >
                            بازگشت به خانه
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Receipt
