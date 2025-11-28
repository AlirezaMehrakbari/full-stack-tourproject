'use client'
import React from 'react'
import Image from "next/image";

interface ReserveProps {
    data: {
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
}

const Reserve = ({ data }: ReserveProps) => {

    const detail = [
        {
            id: 1,
            logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22" fill="none"><path d="M20.6532 4.93359H3.2914C2.22599 4.93359 1.3623 5.79728 1.3623 6.86269V18.4372C1.3623 19.5027 2.22599 20.3663 3.2914 20.3663H20.6532C21.7186 20.3663 22.5823 19.5027 22.5823 18.4372V6.86269C22.5823 5.79728 21.7186 4.93359 20.6532 4.93359Z" stroke="#FF7512" strokeWidth="1.66604" strokeLinecap="round" strokeLinejoin="round" /><path d="M1.3623 10.7207H22.5823" stroke="#FF7512" strokeWidth="1.66604" strokeLinecap="round" strokeLinejoin="round" /></svg>,
            title: "تاریخ سفر",
            matn: new Date(data.from).toLocaleDateString('fa-IR')
        },
        {
            id: 2,
            logo: <svg xmlns="http://www.w3.org/2000/svg" width="27" height="23" viewBox="0 0 27 23" fill="none"><path d="M19.1333 21.3419V19.1205C19.1333 17.9422 18.6653 16.8122 17.8321 15.979C16.9989 15.1458 15.8689 14.6777 14.6906 14.6777H5.80506C4.62677 14.6777 3.49674 15.1458 2.66356 15.979C1.83038 16.8122 1.3623 17.9422 1.3623 19.1205V21.3419" stroke="#FF7512" strokeWidth="1.66604" strokeLinecap="round" strokeLinejoin="round" /></svg>,
            title: "تعداد مسافران",
            matn: data.capacity + " نفر"
        },
        {
            id: 3,
            logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="23" viewBox="0 0 24 23" fill="none"><path d="M11.775 22.1536C17.5258 22.1536 22.1877 17.4916 22.1877 11.7408C22.1877 5.99006 17.5258 1.32812 11.775 1.32812C6.02424 1.32812 1.3623 5.99006 1.3623 11.7408C1.3623 17.4916 6.02424 22.1536 11.775 22.1536Z" stroke="#FF7512" strokeWidth="1.66604" strokeLinecap="round" strokeLinejoin="round" /></svg>,
            title: "هزینه هر شب",
            matn: data.pricePerNight.toLocaleString() + " تومان"
        },
        {
            id: 4,
            logo: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M22.1877 12.966C22.0054 14.9396 21.2647 16.8205 20.0524 18.3884C18.8401 19.9564 17.2063 21.1467 15.3421 21.8201C13.478 22.4934 11.4607 22.6219 9.52621 22.1906C7.59172 21.7592 5.82009 20.7859 4.41861 19.3844C3.01712 17.9829 2.04376 16.2113 1.61242 14.2768C1.18108 12.3423 1.30959 10.325 1.98292 8.46085C2.65625 6.59673 3.84655 4.96293 5.41454 3.75062C6.98253 2.5383 8.86336 1.79762 10.8369 1.61523C9.68147 3.17845 9.12545 5.10448 9.27001 7.043C9.41457 8.98152 10.2501 10.8038 11.6247 12.1783C12.9992 13.5529 14.8215 14.3884 16.76 14.533C18.6985 14.6775 20.6245 14.1215 22.1877 12.966Z" stroke="#FF7512" strokeWidth="1.66604" strokeLinecap="round" strokeLinejoin="round" /></svg>,
            title: "مدت اقامت",
            matn: data.nights + " شب"
        }
    ]

    return (
        <div className='flex flex-col w-full md:flex-row'>
            <div className='w-[350px] mx-auto flex flex-row flex-wrap md:flex-col'>
                {detail.map((item) => (
                    <div key={item.id} className='flex flex-row pr-3 py-3 items-center'>
                        <div>{item.logo}</div>
                        <div className='flex flex-col px-4'>
                            <p>{item.title}</p>
                            <p>{item.matn}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className='w-[90%] flex flex-col py-[14px]'>
                <div className='w-[90%] flex px-[10%]'>
                    <div className='image'>
                        <Image src={data.imageUrl} width={180} height={140} alt='villa' />
                    </div>
                    <div className='flex flex-col'>
                        <p className='mx-[40px] py-2'>{data.title}</p>
                        <p className='mx-[40px] py-2 text-[#777676]'>{data.province} , {data.city}</p>
                    </div>
                </div>

                <div className='py-[23px] px-[120px]'>
                    <p>جزئیات پرداخت</p>
                </div>

                <div className='w-[700px] flex px-[120px]'>
                    <div className='flex flex-col'>
                        <p className='py-2'>{new Date(data.from).toLocaleDateString('fa-IR')}</p>
                        <p>{new Date(data.to).toLocaleDateString('fa-IR')}</p>
                    </div>

                    <div className='flex flex-col px-3'>
                        <p className='px-[150px] py-2'>{data.totalPrice.toLocaleString()} تومان</p>
                        <p className='px-[150px]'>{data.totalPrice.toLocaleString()} تومان</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reserve
