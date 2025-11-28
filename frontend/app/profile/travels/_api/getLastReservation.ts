import { tripTourApi } from "@/axios-instances";

export const getLastReservation = async () => {
    const { data } = await tripTourApi.get("villas/reservations/last");
    return data;
};
