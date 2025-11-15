// app/types/VillaTypes.ts

export type ReviewApi = {
    _id: string;
    user?: string;
    username?: string;
    rating?: number;
    text?: string;
    reply?: string;
    createdAt?: string;
};

export type VillaApiModel = {
    id: number;
    title: string;
    description?: string;
    city?: string;
    province?: string;
    address?: string;
    area?: number;
    suitableFor?: string;
    numRooms?: number;
    floor?: number;
    capacity?: number;
    pricePerNight?: number;
    pricePerPerson?: number;
    rules?: string;
    ownerName?: string;
    ownerDescription?: string;
    ownerId?: number;
    ownerPhoneNumber?: string;
    ownerNationalCode?: string;
    images?: string[];
    facilities?: string[];
    avgRating?: number;
    numReviews?: number;
    reviews?: ReviewApi[];
    createdAt?: string;
    updatedAt?: string;
    constructionYear: number,
    geo?: { lng: string; lat: string };
};

export type VillaFrontModel = {
    id: number;
    user_id: number;
    title: string;
    address: string;
    meter: string;
    suitableFor: string;
    numberOfRooms: string;
    capacity: string;
    type: string;
    layer: string;
    pricePerNight: string;
    pricePerAdditionalPerson: string;
    rules: string;
    deleted_at: string;
    created_at: string;
    updated_at: string;
    constructionYear: number,
    medias: string[];
    rating_comment: {
        averageRating: number;
        totalComments: number;
    };
    facilities: {
        id: number;
        facility: string;
        type: string;
        deleted_at: string;
        created_at: string;
        updated_at: string;
        pivot: {
            place_id: string;
            facility_id: string;
        };
    }[];
    comments: {
        id: number;
        commentable_type: string;
        commentable_id: string;
        user_id: string;
        comment: string;
        rating: string;
        parent_id: string;
        created_at: string;
        updated_at: string;
    }[];
    user: {
        id: number;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        nationalCode: string;
        birthDate: string;
        description: string;
        city: string;
        deleted_at: string;
        created_at: string;
        updated_at: string;
        role: any[];
        permission: any[];
        medias: any[];
    };
};
