
export interface TourGuide {
    name: string;
    phone: string;
    bio: string;
}

export interface Accommodation {
    type: string;
    stars: number;
}

export interface Meals {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
}

export interface ItineraryDay {
    day: number;
    title: string;
    description: string;
    activities: string[];
}

export interface Review {
    user: string;
    rating: number;
    comment: string;
    createdAt: Date;
}

export interface Booking {
    user: string;
    numberOfSeats: number;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    bookingDate: Date;
}

export interface Tour {
    id: number;
    title: string;
    description: string;
    origin: string;
    destination: string;
    price: number;
    startDate: string;
    endDate: string;
    duration: number;
    totalCapacity: number;
    availableSeats: number;
    transportation: 'هواپیما' | 'اتوبوس' | 'قطار' | 'کشتی';
    accommodation: Accommodation;
    meals: Meals;
    itinerary: ItineraryDay[];
    facilities: string[];
    rules: string[];
    cancellationPolicy: string;
    images: string[];
    coverImage: string;
    tourType: string;
    featured: boolean;
    tourGuide: TourGuide;
    reviews?: Review[];
    bookings?: Booking[];
    avgRating?: number;
    numReviews?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface TourFilters {
    origin?: string;
    destination?: string;
    minPrice?: number;
    maxPrice?: number;
    minCapacity?: number;
    maxCapacity?: number;
    minRating?: number;
    sortBy?: 'newest' | 'cheapest' | 'expensive' | 'nearestDate' | 'rating';
    startDate?: string;
    endDate?: string;
    numberOfTravelers?: number;
}

export interface ToursResponse {
    tours: Tour[];
    total: number;
    page: number;
    pages: number;
}

export interface BookTourPayload {
    numberOfSeats: number;
    totalPrice: number;
}

export interface AddReviewPayload {
    rating: number;
    comment: string;
}
