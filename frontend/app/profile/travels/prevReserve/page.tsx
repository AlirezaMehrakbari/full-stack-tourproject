'use client'

import { useQuery } from '@tanstack/react-query'
import Reserve from '@/app/components/profile/Reserve'
import Link from 'next/link'
import SelectDropDown from "@/app/components/dropDown/SelectDropDown"
import {getAllReservations} from "@/app/profile/travels/_api/getAllReservation";

interface Reservation {
    _id: string
    title: string
    province: string
    city: string
    from: string
    to: string
    pricePerNight: number
    capacity: number
    nights: number
    totalPrice: number
    imageUrl: string
}

const PrevReserve = () => {

    const {
        data: reservations = [],
        isLoading,
        isError
    } = useQuery<Reservation[]>({
        queryKey: ['allReservations'],
        queryFn: getAllReservations,
        staleTime: 5 * 60 * 1000,
        retry: 1
    })

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className='px-4 py-6'>
                    <div className='animate-pulse space-y-6'>
                        {[1, 2, 3].map(i => (
                            <div key={i} className='h-32 bg-gray-200 rounded'></div>
                        ))}
                    </div>
                </div>
            )
        }

        if (isError) {
            return (
                <div className='px-4 py-6'>
                    <p className='text-red-500 mb-2'>خطا در دریافت اطلاعات</p>
                    <p className='text-sm text-gray-600'>لطفا دوباره تلاش کنید</p>
                </div>
            )
        }

        if (reservations.length === 0) {
            return (
                <p className='px-4 py-6 text-gray-500'>
                    رزروی یافت نشد.
                </p>
            )
        }

        return reservations.map((res, index) => (
            <div key={res._id || index} className='my-[60px]'>
                <div className='flex w-[75%] border-b border-[#D3D3D3] mx-4'>
                    <p className='pb-4'>جزئیات رزرو شما</p>
                </div>
                <Reserve data={res} />
            </div>
        ))
    }

    return (
        <div className='w-[90%] mx-auto flex flex-col'>
            <h1 className="flex items-center justify-center mx-auto">سفر های من</h1>

            <div className="flex flex-row-reverse justify-between pb-10">
                <div className="w-full mx-auto flex flex-col rounded-md py-8">
                    <div className='flex w-full gap-x-6 border-b border-[#D3D3D3]'>
                        <Link href={'/profile/travels'}>
                            <p className='pb-2 text-[#8B8B8B]'>آخرین رزرو</p>
                        </Link>

                        <p className='pb-2 text-[#000] border-b-2'>رزروهای قبلی</p>
                    </div>

                    {/*<div className='flex justify-end py-3'>*/}
                    {/*    <SelectDropDown*/}
                    {/*        label={'دسته بندی براساس ماه'}*/}
                    {/*        styles={'relative bg-[#465297] text-white px-4 py-2 cursor-pointer rounded-[8px]'}*/}
                    {/*        dropDownStyles={'bg-[#465297] absolute w-full bottom-[-8.5rem] rounded-bl-[8px] rounded-br-[8px] py-2 px-4 text-[13px]'}*/}
                    {/*        labelStyles={'text-[13px]'}*/}
                    {/*    >*/}
                    {/*        <ul className='flex flex-col gap-y-2 items-center'>*/}
                    {/*            <li className='cursor-pointer hover:text-[#FFE712]'>مهر 1402</li>*/}
                    {/*            <li className='cursor-pointer hover:text-[#FFE712]'>شهریور 1402</li>*/}
                    {/*            <li className='cursor-pointer hover:text-[#FFE712]'>مرداد 1402</li>*/}
                    {/*        </ul>*/}
                    {/*    </SelectDropDown>*/}
                    {/*</div>*/}

                    <div className='flex flex-col'>
                        {renderContent()}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default PrevReserve
