'use client'

import {useQuery} from '@tanstack/react-query'
import Reserve from '@/app/components/profile/Reserve'
import Link from 'next/link'
import {getLastReservation} from './_api/getLastReservation'

interface ReservationData {
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

const Travels = () => {
    const {
        data: reservation,
        isLoading,
        isError
    } = useQuery<ReservationData | null>({
        queryKey: ['lastReservation'],
        queryFn: getLastReservation,
        staleTime: 5 * 60 * 1000,
        retry: 1
    })

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className='px-4 py-6'>
                    <div className='animate-pulse'>
                        <div className='h-32 bg-gray-200 rounded'></div>
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

        if (!reservation) {
            return (
                <p className='px-4 py-6 text-gray-500'>
                    رزروی یافت نشد.
                </p>
            )
        }

        return (
            <div className='my-[60px]'>
                <div className='flex w-[75%] border-b border-[#D3D3D3] mx-4'>
                    <p className='pb-4'>جزئیات رزرو شما</p>
                </div>
                <Reserve data={reservation}/>
            </div>
        )
    }

    return (
        <div className='w-[90%] mx-auto flex flex-col'>
            <h1 className="flex items-center justify-center mx-auto">سفر های من</h1>

            <div className="flex flex-row-reverse justify-between pb-10">
                <div className="w-full mx-auto flex flex-col rounded-md py-8">
                    <div className='flex w-full gap-x-6 border-b border-[#D3D3D3]'>
                        <p className='pb-2 text-[#000] border-b-2'>آخرین رزرو</p>

                        <Link href={'travels/prevReserve'}>
                            <p className='pb-2 text-[#8B8B8B]'>رزروهای قبلی</p>
                        </Link>
                    </div>

                    <div className='flex flex-col'>
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Travels
