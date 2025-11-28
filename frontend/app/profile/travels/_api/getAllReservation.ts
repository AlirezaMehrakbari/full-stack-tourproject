import {tripTourApi} from "@/axios-instances";

export const getAllReservations = async () => {
    const { data } = await tripTourApi.get("villas/reservations");
    return data;
};