export type ReviewApi = {
    user: string
    rating: number
    comment: string
    createdAt: string
    _id: string
};

export interface Owner {
    userId: string | number
    name: string
    phone: string
    description: string
}

export interface Rating {
    average: number
    count: number
}


export type VillaApiModel = {
    owner: Owner
    rating: Rating
    _id: string
    id: number
    title: string
    description: string
    province: string
    city: string
    address: string
    area: number
    suitableFor: string
    numRooms: number
    numBeds: number
    numBathrooms: number
    floor: any
    constructionYear: any
    capacity: number
    pricePerNight: number
    pricePerPerson: any
    images: string[]
    coverImage: string
    facilities: string[]
    reviews: any[]
    bookedDates: any[]
    rules: string[]
    cancellationPolicy: string
    availability: boolean
    featured: boolean
    status: string
    createdAt: string
    updatedAt: string
    __v: number
    avgRating: number
    numReviews: number
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
    rules: string[];
    deleted_at: string;
    created_at: string;
    updated_at: string;
    constructionYear: number,
    province: string;
    city: string;
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
    comments: ReviewApi[];
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

export interface CreateVillaData {
    title: string;
    description: string;
    pricePerNight: number;
    pricePerPerson: number;
    capacity: number;
    numRooms: number;
    suitableFor: string[];
    constructionYear: number;
    floor: number;
    area: number;
    province: string;
    city: string;
    address: string;
    facilities: string[];
    images: string[];
    rules: string[];
    ownerName: string;
    ownerDescription: string;
}