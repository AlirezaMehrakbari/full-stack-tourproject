import {VillaApiModel, VillaFrontModel} from "@/app/villa/_types/VillaTypes";

export const mapVillaDataToFront = (apiData: VillaApiModel): VillaFrontModel => {
    return {
        id: apiData.id,
        user_id: apiData.ownerId || 0,

        title: apiData.title,
        address: apiData.address || "",

        meter: apiData.area?.toString() ?? "",
        suitableFor: apiData.suitableFor || "",
        numberOfRooms: apiData.numRooms?.toString() ?? "",
        constructionYear: apiData.constructionYear,
        capacity: apiData.capacity?.toString() ?? "",
        type: "",
        layer: apiData.floor?.toString() ?? "",
        pricePerNight: apiData.pricePerNight?.toString() ?? "",
        pricePerAdditionalPerson: apiData.pricePerPerson?.toString() ?? "",
        rules: apiData.rules || "",
        deleted_at: "",
        created_at: apiData.createdAt || "",
        updated_at: apiData.updatedAt || "",
        medias: apiData.images || [],

        rating_comment: {
            averageRating: apiData.avgRating ?? 0,
            totalComments: apiData.numReviews ?? 0,
        },

        facilities: (apiData.facilities || []).map((f, i) => ({
            id: i + 1,
            facility: f,
            type: "",
            deleted_at: "",
            created_at: "",
            updated_at: "",
            pivot: {
                place_id: apiData.id.toString(),
                facility_id: `${i + 1}`,
            },
        })),

        comments: (apiData.reviews || []).map((r, i) => ({
            id: i + 1,
            commentable_type: "",
            commentable_id: apiData.id.toString(),
            user_id: r.user || "",
            comment: r.text || "",
            rating: r.rating?.toString() ?? "0",
            parent_id: "",
            created_at: r.createdAt || "",
            updated_at: r.createdAt || "",
        })),

        user: {
            id: apiData.ownerId || 0,
            firstName: apiData.ownerName?.split(" ")[0] || "",
            lastName: apiData.ownerName?.split(" ").slice(1).join(" ") || "",
            phoneNumber: apiData.ownerPhoneNumber || "",
            nationalCode: apiData.ownerNationalCode || "",
            birthDate: "",
            description: apiData.ownerDescription || "",
            city: apiData.city || "",
            deleted_at: "",
            created_at: "",
            updated_at: "",
            role: [],
            permission: [],
            medias: [],
        },
    };
};
