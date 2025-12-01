"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tripTourApi } from "@/axios-instances";

export function useToggleFavorite() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (villaId: number) => {
            const res = await tripTourApi.post(`/villas/${villaId}/favorite`);
            return res.data;
        },

        onSuccess: (_, villaId) => {
            qc.invalidateQueries({ queryKey: ["favoriteList"] });
            qc.invalidateQueries({ queryKey: ["villas"] });
        }
    });
}
