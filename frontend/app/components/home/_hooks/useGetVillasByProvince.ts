// app/_hooks/useGetVillasByProvince.ts

import { useQuery } from '@tanstack/react-query';
import { tripTourApi } from '@/axios-instances';

interface VillaByProvince {
    id: number;
    title: string;
    city: string;
    province: string;
    pricePerNight: number;
    images: string[];
    coverImage: string;
}

export const useGetVillasByProvince = (province: string) => {
    return useQuery<VillaByProvince[]>({
        queryKey: ['villasByProvince', province],
        queryFn: async () => {
            console.log(`🔵 Fetching villas for province: ${province}`);
            const response = await tripTourApi.get<VillaByProvince[]>('/villas', {
                params: {
                    province,
                    limit: 6
                }
            });

            console.log('🟢 Villas by province:', response.data);
            return response.data;
        },
        enabled: !!province,
        retry: 1,
    });
};
