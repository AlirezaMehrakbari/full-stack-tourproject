'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import Reserve from '@/app/components/profile/Reserve'
import { useAppSelector } from "@/app/redux/store"
import {getLastReservation} from "@/app/profile/travels/_api/getLastReservation";

const Travels = () => {
    const userSession = useAppSelector(state => state.userSlice)

    const {
        data: lastReservation,
        isLoading,
        error,
        isError
    } = useQuery({
        queryKey: ['lastReservation'],
        queryFn: getLastReservation,
        staleTime: 5 * 60 * 1000,
        retry: 1
    })

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className='px-4 py-6'>
                    <div className='animate-pulse space-y-4'>
                        <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                        <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                    </div>
                </div>
            )
        }

        if (isError) {
            return (
                <div className='px-4 py-6'>
                    <p className='text-red-500 mb-2'>خطا در دریافت اطلاعات</p>
                    <p className='text-sm text-gray-600'>
                        {error instanceof Error ? error.message : 'لطفا دوباره تلاش کنید'}
                    </p>
                </div>
            )
        }

        if (!lastReservation?.reservation) {
            return (
                <p className='px-4 py-6 text-gray-500'>
                    هنوز رزروی ثبت نشده است.
                </p>
            )
        }

        return <Reserve data={lastReservation} />
    }

    return (
        <div className='w-full md:w-[60%] flex flex-col pr-8'>

            <h1 className="font-kalameh700">سفر های من</h1>

            <div className="w-full flex flex-col justify-between pb-10 pt-7 md:flex-row">

                <div className="w-[70%] flex flex-col rounded-md py-8">

                    <div className='flex w-[100%] border-b border-[#D3D3D3] md:w-[40%]'>
                        <Link href={'./travels'}>
                            <p className='pb-2 font-kalameh500 text-[#000] border-b-2'>آخرین رزرو</p>
                        </Link>

                        <Link href={'./travels/prevReserve'}>
                            <p className='mx-7 pb-2 font-kalameh500 text-[#8B8B8B] text-[15px]'>رزروهای قبلی</p>
                        </Link>
                    </div>

                    <div className='flex w-[75%] border-b border-[#D3D3D3] mx-4 mt-[77px]'>
                        <p className='pb-4 font-kalameh400 text-[18.97px] text-[#000]'>
                            جزئیات آخرین رزرو شما
                        </p>
                    </div>

                    <div className='w-full md:w-[75%]'>
                        {renderContent()}
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Travels
