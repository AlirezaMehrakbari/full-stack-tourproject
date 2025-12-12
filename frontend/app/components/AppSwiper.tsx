'use client'
// Import Swiper React components
import {Swiper, SwiperSlide} from 'swiper/react';
import {useSwiper} from 'swiper/react';
// @ts-ignore
import {Autoplay} from "swiper/modules";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/bundle'
import 'swiper/css/autoplay'
import Image, {StaticImageData} from "next/image";
import Arrow from '@/public/icons/Arrow.svg'
import {useRouter} from "next/navigation";


export function SlideNextButton() {
    const swiper = useSwiper();

    return (
        <button className='flex w-full justify-end absolute top-[10rem]  z-10' onClick={() => swiper.slideNext()}>
            <Image
                src={Arrow}
                alt='Arrow Left'/>
        </button>
    );
}

type AppSwiper = {
    id: number,
    title: string,
    src: string
}
type AppSwiperProps = {
    data: AppSwiper[]
}

const AppSwiper: React.FC<AppSwiperProps> = ({data}) => {
    const router = useRouter()
    // const swiper = useSwiper()
    return (
        <Swiper
            slidesPerView={1}
            modules={[Autoplay]}
            autoplay={{
                delay: 2000,
                pauseOnMouseEnter: true,
                disableOnInteraction: false
            }}
            breakpoints={{
                320: {
                    slidesPerView: 1,
                    spaceBetween: 50,
                },
                480: {
                    slidesPerView: 1.5,
                    spaceBetween: 50,
                },
                600: {
                    slidesPerView: 2,
                    spaceBetween: 50,
                },
                750: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                },
                1000: {
                    slidesPerView: 3.5,
                    spaceBetween: 30,
                },
                1300: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                },
                1350: {
                    slidesPerView: 4.5,
                    spaceBetween: 30,
                },
            }}
            className='relative'
            // spaceBetween={100}
            // slidesPerView={4.5}
            loop={true}
            speed={600}
            // onSlideChange={() => console.log('slide change')}
            // onSwiper={(swiper) => console.log(swiper)}
        >
            <SlideNextButton/>
            {data.map(item => {
                return (
                    <SwiperSlide>
                        <div className='flex flex-col items-center' onClick={()=>router.push(`/villa/${item.id}`)}>
                            <div
                            className={"w-full h-[250px] relative"}
                            >
                                <Image
                                    src={item.src}
                                    alt={item.title}
                                    fill
                                className='mx-auto rounded-[12px] shadow-lg object-cover'/>
                            </div>
                            <p className='pt-3 font-kalameh400 text-[20px]'>{item.title}</p>
                        </div>
                    </SwiperSlide>
                )
            })}

        </Swiper>
    );
};

export default AppSwiper