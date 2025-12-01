"use client";
import { useQuery } from "@tanstack/react-query";
import { tripTourApi } from "@/axios-instances";

export function useFavoriteList() {
    return useQuery({
        queryKey: ["favoriteList"],
        queryFn: async () => {
            const res = await tripTourApi.get("/villas/favorites");
            return res.data;
        },
        staleTime: 1000 * 60,
    });
}
