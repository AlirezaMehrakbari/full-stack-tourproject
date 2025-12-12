'use client'
import Image from "next/image";
import {CiLocationOn} from "react-icons/ci";
import testImage from '@/public/images/HomePic.png'
import {TfiMoney} from "react-icons/tfi";
import Loading from "@/app/components/Loading";
import {useAppSelector} from "@/app/redux/store";
import {useFavoriteList} from "@/app/villa/_hooks/useFavoriteList";
import {useMemo} from "react";
import {mapVillaDataToFront} from "@/app/villa/_utils/mapVillaDataToFront";
import {VillaApiModel, VillaFrontModel} from "@/app/villa/_types/VillaTypes";
import Link from "next/link";
import FormatCurrency from "@/app/utils/FormatCurrency";

const Favorite = () => {
    const userSession = useAppSelector(state => state.userSlice)
    const {data, isLoading} = useFavoriteList();
    const favorites = useMemo(() => {
        return data?.map((item: VillaApiModel) => {
            return mapVillaDataToFront(item)
        })
    }, [data])
    if (isLoading) return <Loading/>
    if (!favorites) return <p>Not found!!</p>
    return (
        <div className={'lg:pr-8'}>
            <h1 className="font-kalameh700 pb-12 max-md:pt-10 max-md:text-center">مورد علاقه ها</h1>
            {(favorites && favorites.length > 0) ?
                <div
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 rounded-md">

                    {favorites.map((item: VillaFrontModel) => (
                        <Link href={`/villa/${item.id}`}>
                            <div
                                className="w-full flex flex-col text-[#706E6E] hover:text-[#000] cursor-pointer">
                                <div
                                    className={'relative w-full h-[200px]'}
                                >
                                    <Image
                                        className='rounded-md object-cover'
                                        src={item.medias[0]}
                                        alt={'none'}
                                        fill
                                    />
                                </div>
                                <div className="flex flex-row justify-between py-2 px-[2.98px]">
                                    <div className="flex flex-row justify-center">
                                        <p className="text-[9.85px]">{item.rating_comment.totalComments}</p>
                                        <p className="text-[9.85px] px-2">دیدگاه</p>
                                    </div>
                                    <div className="flex flex-row items-center">
                                        <p className="text-[9.85px] px-1">
                                            {Math.round(item.rating_comment.averageRating)}
                                        </p>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11"
                                             viewBox="0 0 11 11" fill="none">
                                            <path
                                                d="M5.8182 1.0918L7.1999 4.03519L10.2897 4.51009L8.05396 6.79992L8.58159 10.0348L5.8182 8.50671L3.0548 10.0348L3.58244 6.79992L1.34668 4.51009L4.4365 4.03519L5.8182 1.0918Z"
                                                fill="#FFF500" stroke="#FFF500" strokeWidth="1.1924"
                                                strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>

                                </div>
                                <h1 className='font-kalameh500 text-[13.72px] text-[#000] px-[2.98px]'>{item.title} </h1>
                                <div className="flex flex-row py-2 px-[2.98px]">
                                    <CiLocationOn/>
                                    <p className="px-1 text-[8.372px] ">{item.province} | </p>
                                    <p className="px-1 text-[8.372px] "> {item.city}</p>
                                </div>

                                <div className="flex flex-row justify-between pb-[52px] px-[2.98px]">
                                    <div className="flex flex-row">
                                        <TfiMoney/>
                                        <p className="text-[8.372px]">قیمت برای هر شب</p>
                                    </div>

                                    <div className="flex flex-row">
                                        <p className="text-[8.372px] font-kalameh400 ">{FormatCurrency(+item.pricePerNight)} ریال</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                :
                <div
                    className={"w-full flex items-center justify-center mx-auto"}
                >
                    <Image
                        src={"/images/noData.jpg"}
                        alt={""}
                        width={300}
                        height={300}
                    />
                </div>
            }
        </div>
    )
}

export default Favorite


