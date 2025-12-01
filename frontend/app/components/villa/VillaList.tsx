"use client";
import React from "react";
import VillaItem from "@/app/components/villa/VillaItem";
import { toast } from "react-toastify";
import fallbackImage from "@/public/images/test.jpg";
import {useToggleFavorite} from "@/app/villa/_hooks/useToggleFavorite";
import {useFavoriteList} from "@/app/villa/_hooks/useFavoriteList";

type VillaListProps = {
    data: {
        id: number;
        title: string;
        city: string;
        pricePerNight: number;
        capacity: number;
        avgRating: number;
        images: string[] | null;
        province: string;
        numReviews: number;
    }[];
};

const VillaList: React.FC<VillaListProps> = ({ data }) => {
    const { data: favorites } = useFavoriteList();
    const toggleFavorite = useToggleFavorite();

    const handleFavorite = (villaId: number) => {
        toggleFavorite.mutate(villaId, {
            onSuccess: (res) => {
                if (res.message === "insert to favorites") {
                    toast.success("به علاقه‌مندی‌ها اضافه شد.");
                } else if (res.message === "delete from favorites") {
                    toast.warn("از علاقه‌مندی‌ها حذف شد.");
                }
            },

            onError: () => {
                toast.error("خطایی در ارتباط با سرور رخ داده است!");
            },
        });
    };

    const favoriteIds = favorites?.map((v: any) => v.id) ?? [];

    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
            {data.map((villa) => (
                <VillaItem
                    key={villa.id}
                    id={villa.id}
                    image={villa.images ? villa.images[0] : fallbackImage}
                    title={villa.title}
                    province={villa.province}
                    city={villa.city}
                    price={villa.pricePerNight?.toString()}
                    Satisfaction={villa.avgRating}
                    opinion={villa.numReviews}
                    favoriteList={favoriteIds}
                    onClickFavorite={() => handleFavorite(villa.id)}
                />
            ))}
        </div>
    );
};

export default VillaList;
