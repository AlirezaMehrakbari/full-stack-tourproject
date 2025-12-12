
import { useQuery } from '@tanstack/react-query';
import { tripTourApi } from '@/axios-instances';

interface Villa {
    id: number;
    title: string;
    description: string;
    pricePerNight: number;
    capacity: number;
    province: string;
    city: string;
    numRooms: number;
    area: number;
    images: string[];
    coverImage: string;
    rating: {
        average: number;
        count: number;
    };
    facilities: string[];
    suitableFor: string;
}

export const useGetFeaturedVillas = () => {
    return useQuery<Villa[]>({
        queryKey: ['featuredVillas'],
        queryFn: async () => {
            console.log('🔵 Fetching featured villas...');
            const response = await tripTourApi.get<Villa[]>('/villas', {
                params: {
                    featured: true,
                    limit: 10
                }
            });

            console.log('🟢 Featured villas:', response.data);
            return response.data;
        },
        retry: 2,
    });
};
