'use client'
import React, {useState} from 'react'
import {useQuery} from '@tanstack/react-query'
import Navbar from "@/app/components/navbar/Navbar"
import Image from "next/image"
import TourHomePicture from '@/public/images/TourHomePicture.png'
import TourHomePicture1 from '@/public/images/TourHomePicture1.png'
import TourHomePicture2 from '@/public/images/TourHomePicture2.png'
import TourHomePicture3 from '@/public/images/TourHomePicture3.png'
import TourGillan from '@/public/images/TourGillan.png'
import Layout from "@/app/components/Layout"
import TourList from "@/app/components/tour/TourList"
import Link from "next/link"
import Footer from "@/app/components/footer/footer"
import SelectDropDown from "@/app/components/dropDown/SelectDropDown"
import persian_fa from "react-date-object/locales/persian_fa"
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import DateObject from "react-date-object"
import moment from "jalali-moment"
//@ts-ignore
import opacity from "react-element-popper/animations/opacity"
import DatePickerPlugin from "@/app/components/plugin/DatePickerPlugin"
import {getTours} from "@/app/tour/_api/tourApis";

const TourHomePage = () => {
    const [origin, setOrigin] = useState('مبدا')
    const [destination, setDestination] = useState('مقصد')
    const [passengers, setPassengers] = useState(0)
    const [values, setValues] = useState([])
    const [filterValue, setFilterValue] = useState('فیلتر')
    const [sortBy, setSortBy] = useState<'newest' | 'cheapest' | 'expensive' | 'nearestDate' | 'rating' | undefined>(undefined)

    const {data: toursData, isLoading, isError} = useQuery({
        queryKey: ['tours', origin, destination, values, passengers, sortBy],
        queryFn: () => getTours({
            origin: origin !== 'مبدا' ? origin : undefined,
            destination: destination !== 'مقصد' ? destination : undefined,
            startDate: values[0] ? moment.from(new DateObject(values[0]).format(), 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD') : undefined,
            endDate: values[1] ? moment.from(new DateObject(values[1]).format(), 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD') : undefined,
            //@ts-ignore
            passengers: passengers > 0 ? passengers : undefined,
            sortBy,
        }),
    });

    const jazebeTouristi = [
        {
            id: 1,
            src: "https://navardino.ir/mag/wp-content/uploads/2024/04/%D9%82%D9%84%D8%B9%D9%87-%D8%B1%D9%88%D8%AF%D8%AE%D8%A7%D9%86.jpg",
            title: 'گیلان'
        },
        {
            id: 2,
            src: "https://www.safarbazi.com/mag/wp-content/uploads/2023/11/%D8%AA%D8%AE%D8%AA-%D8%AC%D9%85%D8%B4%DB%8C%D8%AF-%D8%B4%DB%8C%D8%B1%D8%A7%D8%B2.jpg",
            title: 'تخت جمشید'
        },
        {id: 3, src: "https://www.otaghak.com/blog/wp-content/uploads/2021/11/about-yazd19-1.webp", title: 'یزد'},
        {
            id: 4,
            src: "https://amagestate.com/wp-content/uploads/%D8%AD%D8%A7%D9%81%D8%B8%DB%8C%D9%87-%D9%86%D9%85%D8%A7%D8%AF%DB%8C-%D8%A7%D8%B2-%D8%B4%DB%8C%D8%B1%D8%A7%D8%B2.webp",
            title: 'شیراز'
        },
        {
            id: 5,
            src: "https://cdn.donya-e-eqtesad.com/thumbnail/857J4yDU9BXY/QHn8O9nsSzT8qCU7RegsN6Pbb5v74eEtbKeSOh05RaYX5XCoSVKqAUt7TZyzEhnm/%D9%85%D8%AD%D9%88%D8%B1%DB%8C+%D8%A8%D8%A7%D9%84%D8%A7+copy.jpg",
            title: 'اصفهان'
        },
        {
            id: 6,
            src: "https://api2.kojaro.com/media/2017-8-a25ea7db-da97-43ba-8e3e-533a5c4267d6-67c460ddc1067c5ba76162d7",
            title: 'کاشان'
        },
        {
            id: 7,
            src: "https://lahzeakhar.com/files/bloggallery/26d33175-e4a3-44be-a0b2-e8ac60e6fe78.jpg",
            title: 'مشهد'
        },
        {id: 8, src: "https://safarmarket.com/blog/data/uploaded_files/f53ec7e167cd5a89462a74c2.jpg", title: 'تبریز'},
    ]

    const questions = [
        {
            id: 1,
            question: '1.چطور میتوانم ثبت نام کنم؟',
            answer: `برای اینکار ابتدا باید حساب کاربری خود را بسازید از قسمت عضویت \nمیتوانید اینکار را انجام دهید`
        },
        {
            id: 2,
            question: '2.چگونه میتوانم تور مورد نظر خود را رزرو کنم؟',
            answer: 'ابتدا تور مورد نظرتان را بر اسـاس مبدا، مقصد، تاریخ سفر، و تعداد مسافران انتخاب کنید'
        },
        {
            id: 3,
            question: '3.بعد از پایان سفر امکان ثبت نظر دارم؟',
            answer: 'بعد از پایان سفر لینک نظر سنجی از طرف تریپ تور برای شما ارسال میشود'
        },
    ]

    const provinces = [
        {id: 1, provinceName: 'تهران'},
        {id: 2, provinceName: 'اصفهان'},
        {id: 3, provinceName: 'شیراز'},
        {id: 4, provinceName: 'مشهد'},
        {id: 5, provinceName: 'تبریز'},
    ]

    const handleIncreasePassenger = () => setPassengers(prev => prev + 1)
    const handleDecreasePassenger = () => {
        if (passengers === 0) return
        setPassengers(prev => prev - 1)
    }

    const handleSearch = (e: any) => {
        e.preventDefault()
    }

    const handleSortChange = (sortType: any) => {
        setSortBy(sortType)
        setFilterValue(sortType === 'newest' ? 'به روزترین' :
            sortType === 'cheapest' ? 'ارزانترین' :
                sortType === 'expensive' ? 'گران‌ترین' :
                    sortType === 'nearestDate' ? 'نزدیک‌ترین تاریخ' : 'پیشنهاد ما')
    }

    return (
        <>
            <Navbar/>
            <div className='flex flex-col px-4 sm:px-10 lg:px-20 xl:px-28'>
                <Image
                    className='rounded-xl mt-[12rem] max-h-[564px] xl:max-w-[1164px] lg:max-w-[900px] md:max-w-[700px] mx-auto object-cover'
                    src={TourHomePicture}
                    alt='Tour Picture'/>

                <div className='mx-auto mt-[-30px]'>
                    <Layout>
                        <form onSubmit={handleSearch}
                              className='xl:w-[1020px] grid xl:grid-cols-5 md:grid-cols-2 gap-8'
                        >
                            <div className='flex flex-col gap-y-4'>
                                <p className='text-[20.6px] font-kalameh700 text-white'>از کجا میخوای بـری؟!</p>
                                <SelectDropDown main label={origin}
                                                dropDownStyles={'absolute bg-[#FFF] top-10 w-full shadow-md rounded-md text-[#000] left-[2px] px-4 py-2'}>
                                    <div className='flex flex-col divide-y divide-[#D3D3D3]'>
                                        {provinces.map(province => (
                                            <div key={province.id} className='py-2 cursor-pointer'
                                                 onClick={() => setOrigin(province.provinceName)}>
                                                {province.provinceName}
                                            </div>
                                        ))}
                                    </div>
                                </SelectDropDown>
                            </div>

                            <div className='flex flex-col gap-y-4'>
                                <p className='text-[20.6px] font-kalameh700 text-white'>کجـا میخوای بـری ؟!</p>
                                <SelectDropDown main label={destination}
                                                dropDownStyles={'absolute bg-[#FFF] top-10 w-full shadow-md rounded-md text-[#000] left-[2px] px-4 py-2'}>
                                    <div className='flex flex-col divide-y divide-[#D3D3D3]'>
                                        {provinces.map(province => (
                                            <div key={province.id} className='py-2 cursor-pointer'
                                                 onClick={() => setDestination(province.provinceName)}>
                                                {province.provinceName}
                                            </div>
                                        ))}
                                    </div>
                                </SelectDropDown>
                            </div>

                            <div className='z-0 flex flex-col gap-y-4'>
                                <p className='text-[20.6px] font-kalameh700 text-white'>کِی میخوای بـری ؟!</p>
                                <DatePicker
                                    //@ts-ignore
                                    plugins={[<DatePickerPlugin key="plugin" position='top'/>]}
                                    dateSeparator=' تا '
                                    animations={[opacity()]}
                                    inputClass='cursor-pointer w-full bg-transparent text-white border-b-[1px] rounded-md outline-none placeholder:text-white text-[14px] font-kalameh400 px-2'
                                    minDate={new DateObject()}
                                    placeholder={'تاریخ سفر را مشخص کنید'}
                                    value={values}
                                    //@ts-ignore
                                    onChange={setValues}
                                    range
                                    calendar={persian}
                                    locale={persian_fa}
                                />
                            </div>

                            <div className='flex flex-col gap-y-4'>
                                <p className='text-[20.6px] font-kalameh700 text-white'>چند نفـر ؟!</p>
                                <SelectDropDown main isCounter
                                                label={(passengers > 0 ? `${passengers} مسافر` : 'تعداد مسافران')}
                                                dropDownStyles={'absolute bg-[#FFF] top-10 w-[300px] inset-x-0 rounded-md text-[#000] mx-auto shadow-md px-4 py-2'}>
                                    <div className='flex items-center justify-between'>
                                        <p className='font-kalameh400'>تعداد نفــرات</p>
                                        <div className='flex items-center gap-x-2'>
                                            <button type='button' onClick={handleIncreasePassenger}
                                                    className='w-[24px] h-[24px] bg-[#1270B0] rounded-full text-white'>+
                                            </button>
                                            <span>{passengers}</span>
                                            <button type='button' onClick={handleDecreasePassenger}
                                                    className='w-[24px] h-[24px] border-[2px] border-[#1270B0] rounded-full'>-
                                            </button>
                                        </div>
                                    </div>
                                </SelectDropDown>
                            </div>

                            <div className='flex justify-center items-center md:col-span-2 xl:col-span-1'>
                                <button type="submit"
                                        className='text-[22px] font-kalameh500 bg-[#83734E] text-white px-8 py-2 rounded-full'>
                                    جست و جو
                                </button>
                            </div>
                        </form>
                    </Layout>
                </div>

                <section className='w-full mx-auto'>
                    <div className='flex justify-between pt-20'>
                        <h4 className='sm:text-[20.6px] font-kalameh700'>دسـته بندی بر اسـاس</h4>

                        <div className='hidden lg:flex items-center justify-between lg:gap-x-2 w-[70%]'>
                            <button onClick={() => handleSortChange('')}
                                    className='bg-[#F0F0F0] rounded-[50px] text-[14px] font-kalameh500 p-2 w-full'>
                                پیـشــنهاد مــا
                            </button>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1" height='40' viewBox="0 0 1 115">
                                <path d="M0.5 1L0.499995 114" stroke="#000" strokeOpacity="0.67" strokeWidth="0.8"/>
                            </svg>
                            <button onClick={() => handleSortChange('newest')}
                                    className='bg-[#F0F0F0] rounded-[50px] text-[14px] font-kalameh500 p-2 w-full'>
                                به روزترین
                            </button>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1" height='40' viewBox="0 0 1 115">
                                <path d="M0.5 1L0.499995 114" stroke="#000" strokeOpacity="0.67" strokeWidth="0.8"/>
                            </svg>
                            <button onClick={() => handleSortChange('cheapest')}
                                    className='bg-[#F0F0F0] rounded-[50px] text-[14px] font-kalameh500 p-2 w-full'>
                                ارزانترین
                            </button>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1" height='40' viewBox="0 0 1 115">
                                <path d="M0.5 1L0.499995 114" stroke="#000" strokeOpacity="0.67" strokeWidth="0.8"/>
                            </svg>
                            <button onClick={() => handleSortChange('expensive')}
                                    className='bg-[#F0F0F0] rounded-[50px] text-[14px] font-kalameh500 p-2 w-full'>
                                گران ترین
                            </button>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1" height='40' viewBox="0 0 1 115">
                                <path d="M0.5 1L0.499995 114" stroke="#000" strokeOpacity="0.67" strokeWidth="0.8"/>
                            </svg>
                            <button onClick={() => handleSortChange('nearestDate')}
                                    className='bg-[#F0F0F0] rounded-[50px] text-[14px] font-kalameh500 p-2 w-full'>
                                نزدیک ترین تاریـخ
                            </button>
                        </div>

                        <SelectDropDown
                            label={filterValue}
                            styles={'flex lg:hidden relative bg-orange text-white px-4 py-2 rounded-[8px] cursor-pointer w-[40%] sm:w-[20%]'}
                            labelStyles={'font-kalameh500'}
                        >
                            <div
                                className='absolute bg-orange text-white top-[22px] py-4 px-2 w-full rounded-br-[7.6px] rounded-bl-[7.6px]'>
                                <ul className='flex flex-col gap-y-2'>
                                    <li onClick={() => handleSortChange('')} className='cursor-pointer'>پیـشــنهاد
                                        مــا
                                    </li>
                                    <li onClick={() => handleSortChange('newest')} className='cursor-pointer'>به روز
                                        تریــن
                                    </li>
                                    <li onClick={() => handleSortChange('cheapest')}
                                        className='cursor-pointer'>ارزانترین
                                    </li>
                                    <li onClick={() => handleSortChange('expensive')} className='cursor-pointer'>گران
                                        ترین
                                    </li>
                                    <li onClick={() => handleSortChange('nearestDate')} className='cursor-pointer'>نزدیک
                                        ترین تاریخ
                                    </li>
                                </ul>
                            </div>
                        </SelectDropDown>
                    </div>

                    {isLoading && <p className='text-center py-8'>در حال بارگذاری...</p>}
                    {isError && <p className='text-center py-8 text-red-500'>خطا در دریافت داده‌ها</p>}
                    {toursData && <TourList data={toursData.tours}/>}
                </section>

                <section className='w-full py-8 mx-auto'>
                    <div className="relative flex py-5 items-baseline">
                        <div className="flex-grow border-t border-[#5F5F5F99]"></div>
                        <span
                            className="flex-shrink mx-4 text-gray-400 text-[32.4px] font-kalameh500">جاذبـه های توریستی</span>
                        <div className="flex-grow border-t border-[#5F5F5F99]"></div>
                    </div>

                    <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
                        {jazebeTouristi.map(item => (
                            <div key={item.id} className='relative cursor-pointer group'>
                                <div
                                    className={'w-full h-[200px] md:h-[150px]'}
                                >
                                    <Image
                                        className='w-full h-full rounded-md object-cover'
                                        src={item.src}
                                        alt={item.title}
                                        fill
                                    />
                                </div>
                                <div
                                    className='absolute bg-gradient-to-t from-[#524F4F] to-[#02020200] to-30% inset-0 rounded-md'></div>
                                <div
                                    className='hidden absolute group-hover:flex flex-col justify-center items-center text-white inset-0 bg-[#0000004D]'>
                                    <h1 className='text-[28.3px] font-kalameh500'>{item.title}</h1>
                                    {/*<p className='bg-[#D2BA00] text-[20px] font-kalameh500 px-4 rounded-[8px]'>جزئیات*/}
                                    {/*    خرید</p>*/}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className='w-full mx-auto mt-[6rem] flex flex-col gap-y-4'>
                    <h1 className='text-[20px] md:text-[32.4px] font-kalameh500 pr-2'>سوالات متداول</h1>
                    {questions.map(item => (
                        <div key={item.id} className="collapse collapse-arrow bg-[#F4FDFB]">
                            <input type="radio" name="my-accordion-2"/>
                            <div className="collapse-title lg:text-[24px] text-[#15247B] font-kalameh400">
                                {item.question}
                            </div>
                            <div className="collapse-content">
                                <p className='lg:text-[28px] whitespace-pre'>{item.answer}</p>
                            </div>
                        </div>
                    ))}
                </section>

            </div>
            <Footer/>
        </>
    )
}

export default TourHomePage
