'use client'
import React from 'react'
import Image from "next/image";
import {MdDateRange, MdPeopleAlt} from "react-icons/md";
import {AiOutlineDollar} from "react-icons/ai";
import {FaMoon} from "react-icons/fa";

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
            logo: <MdDateRange color={"#FF7512"} size={20}/>,
            title: "تاریخ سفر",
            matn: new Date(data.from).toLocaleDateString('fa-IR')
        },
        {
            id: 2,
            logo: <MdPeopleAlt color={"#FF7512"} size={20}/>,
            title: "تعداد مسافران",
            matn: data.capacity + " نفر"
        },
        {
            id: 3,
            logo: <AiOutlineDollar color={"#FF7512"} size={20}/>,
            title: "هزینه هر شب",
            matn: data.pricePerNight.toLocaleString() + " ریال"
        },
        {
            id: 4,
            logo: <FaMoon color={"#FF7512"} size={20}/>,
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

                {/*<div className='py-[23px] px-[120px]'>*/}
                {/*    <p>جزئیات پرداخت</p>*/}
                {/*</div>*/}

                <div className='w-[700px] flex px-[120px]'>
                    <div className='flex flex-col'>
                        <p className='py-2'>{new Date(data.from).toLocaleDateString('fa-IR')}</p>
                        <p>{new Date(data.to).toLocaleDateString('fa-IR')}</p>
                    </div>

                    {/*<div className='flex flex-col px-3'>*/}
                    {/*    <p className='px-[150px] py-2'>{data.totalPrice.toLocaleString()} تومان</p>*/}
                    {/*    <p className='px-[150px]'>{data.totalPrice.toLocaleString()} تومان</p>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    )
}

export default Reserve
