import {tripTourApi} from "@/axios-instances";


export const getVillaList = async (filters: Record<string, any>) => {
    const params = new URLSearchParams(filters).toString();
    const { data } = await tripTourApi.get(`villas?${params}`);
    return data
};
