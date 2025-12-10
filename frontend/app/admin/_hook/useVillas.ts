import { useMutation, useQueryClient } from '@tanstack/react-query';
import {tripTourApi} from "@/axios-instances";
import {CreateVillaData} from "@/app/villa/_types/VillaTypes";

export const useCreateVilla = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateVillaData): Promise<Villa> => {
            const response = await tripTourApi.post('/villas', data);
            return response.data.villa;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myVillas'] });
        },
    });
};
