import React, {useState} from 'react';
import VillaItem from "@/app/components/villa/VillaItem";
import {useAppSelector} from "@/app/redux/store";
import {toast} from "react-toastify";
import {tripTourApi} from "@/axios-instances";
import fallbackImage from '@/public/images/test.jpg'; // تصویر پیش‌فرض اگر image = null باشد

export type FavoriteListType = {
    id: number;
};

type VillaListProps = {
    data: {
        id: number;
        title: string;
        city: string;
        pricePerNight: number;
        capacity: number;
        avgRating: number;
        image: string | null;
        province: string,
        numReviews: number
    }[];
};

const VillaList: React.FC<VillaListProps> = ({data}) => {
    const userSession = useAppSelector(state => state.userSlice);
    const [favoriteList, setFavoriteList] = useState<FavoriteListType[]>([]);

    const handleFavoritePlace = async (villaId: number) => {
        const isFavorite = favoriteList.some(item => item.id === villaId);

        if (isFavorite) {
            setFavoriteList(prev => prev.filter(item => item.id !== villaId));
        } else {
            setFavoriteList(prev => [...prev, {id: villaId}]);
        }

        try {
            const res = await tripTourApi.post(
                `users/manageFavoritePlaces/${villaId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${userSession.value.token}`,
                    },
                }
            );

            if (res.data.message === "insert to favorites") {
                toast.success('به علاقه‌مندی‌ها اضافه شد.');
            } else if (res.data.message === "delete from favorites") {
                toast.warn('از علاقه‌مندی‌ها حذف شد.');
            }
        } catch (err) {
            toast.error('خطایی در ارتباط با سرور رخ داده است!');
        }
    };

    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
            {data.map((villa) => (
                <VillaItem
                    key={villa.id}
                    id={villa.id}
                    image={villa.image ? villa.image : fallbackImage}
                    title={villa.title}
                    province={villa.province}
                    city={villa.city}
                    price={villa.pricePerNight.toString()}
                    Satisfaction={villa.avgRating}
                    opinion={villa.numReviews}
                    favoriteList={favoriteList}
                    onClickFavorite={() => handleFavoritePlace(villa.id)}
                />
            ))}
        </div>
    );
};

export default VillaList;
