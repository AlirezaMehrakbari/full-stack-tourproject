import {tripTourApi} from "@/axios-instances";


export const getVillaDetail = async (id: number | string) => {
    const {data} = await tripTourApi.get(`villas/${id}`);
    return data;
};
