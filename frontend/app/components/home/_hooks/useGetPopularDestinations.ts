import {useQuery} from '@tanstack/react-query';
import {tripTourApi} from '@/axios-instances';

interface Destination {
    id: number,
    province: string;
    city: string;
    count: number;
    averagePrice: number;
    image: string;
}

export const useGetPopularDestinations = () => {
    return useQuery<Destination[]>({
        queryKey: ['popularDestinations'],
        queryFn: async () => {

            const response = await tripTourApi.get('/villas');
            const villas = response.data;

            const grouped = villas.reduce((acc: any, villa: any) => {
                const key = `${villa.province}-${villa.city}`;
                if (!acc[key]) {
                    acc[key] = {
                        id: villa.id,
                        province: villa.province,
                        city: villa.city,
                        count: 0,
                        totalPrice: 0,
                        image: villa.coverImage || villa.images[0]
                    };
                }
                acc[key].count++;
                acc[key].totalPrice += villa.pricePerNight;
                return acc;
            }, {});

            const destinations = Object.values(grouped).map((dest: any) => ({
                ...dest,
                averagePrice: Math.round(dest.totalPrice / dest.count)
            }));

            return destinations.sort((a: any, b: any) => b.count - a.count).slice(0, 10);
        },
        retry: 2,
    });
};
