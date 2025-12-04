// services/tourService.ts

import { tripTourApi } from "@/axios-instances";
import {Tour, TourFilters, ToursResponse} from "@/app/tour/_types/tourTypes";

export const getTours = async (filters: TourFilters): Promise<ToursResponse> => {
    const params = new URLSearchParams();

    if (filters.origin) params.append('origin', filters.origin);
    if (filters.destination) params.append('destination', filters.destination);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.numberOfTravelers) params.append('passengers', filters.numberOfTravelers.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);

    const { data } = await tripTourApi.get<ToursResponse>(`/tours?${params.toString()}`);
    return data;
};

export const getTourById = async (id: number | string): Promise<Tour> => {
    const { data } = await tripTourApi.get<Tour>(`/tours/${id}`);
    return data;
};

interface BookTourParams {
    tourId: number | string;
    passengers: number;
}

export const bookTour = async ({ tourId, passengers }: BookTourParams): Promise<Tour> => {
    const { data } = await tripTourApi.post<Tour>(`/tours/${tourId}/book`, {
        passengers,
    });
    return data;
};

interface AddReviewParams {
    tourId: number | string;
    rating: number;
    comment: string;
}

export const addReview = async ({ tourId, rating, comment }: AddReviewParams): Promise<Tour> => {
    const { data } = await tripTourApi.post<Tour>(`/tours/${tourId}/review`, {
        rating,
        comment,
    });
    return data;
};
