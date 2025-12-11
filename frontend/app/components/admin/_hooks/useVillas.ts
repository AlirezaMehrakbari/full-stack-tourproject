import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {tripTourApi} from "@/axios-instances";
import {useRouter} from "next/navigation";
import {toast} from "react-hot-toast";
import {VillaFormData} from "@/app/components/admin/villaForm";
interface User {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    description: string;
}

interface DeleteVillaResponse {
    message: string;
    success: boolean;
}

export const useProfile = () => {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const response = await tripTourApi.get('/users/profile');
            return response.data.user as User;
        }
    });
};

export const useVillaDetails = (id: string | null) => {
    return useQuery({
        queryKey: ['villa', id],
        queryFn: async () => {
            if (!id) return null;
            console.log('🔵 Fetching villa with ID:', id);
            const response = await tripTourApi.get(`/villas/${id}`);
            console.log('🟢 Villa data received:', response.data);
            return response.data;
        },
        enabled: !!id
    });
};

export const useCreateVilla = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: async (data: VillaFormData) => {
            const response = await tripTourApi.post('/villas', data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('ویلا با موفقیت ایجاد شد! 🎉');
            setTimeout(() => {
                router.push('/owner/my-villas');
            }, 2000);
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'خطا در ایجاد ویلا';
            toast.error(message);
        }
    });
};

export const useUpdateVilla = (id: string) => {
    const router = useRouter();

    return useMutation({
        mutationFn: async (data: VillaFormData) => {
            const response = await tripTourApi.put(`/villas/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('ویلا با موفقیت ویرایش شد! ✅');
            setTimeout(() => {
                router.push('/owner/my-villas');
            }, 2000);
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'خطا در ویرایش ویلا';
            toast.error(message);
        }
    });
};




export const useDeleteVilla = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const res = await tripTourApi.delete(`/villas/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-villas"] });
        },
    });
};

export interface Villa {
    id: number;
    title: string;
    province: string;
    city: string;
    pricePerNight: number;
    images: string[];
    capacity: number;
}

export const useGetMyVillas = () => {
    return useQuery({
        queryKey: ["my-villas"],
        queryFn: async () => {
            const res = await tripTourApi.get("/villas/owner/my-villas");
            return res.data.villas as Villa[];
        },
    });
};

