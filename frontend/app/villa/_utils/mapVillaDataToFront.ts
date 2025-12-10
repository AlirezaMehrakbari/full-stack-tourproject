import {VillaApiModel, VillaFrontModel} from "@/app/villa/_types/VillaTypes";

export const mapVillaDataToFront = (apiData: VillaApiModel): VillaFrontModel => {
    console.log(apiData)
    return {
        id: apiData.id,
        user_id: apiData.owner.userId as number || 0,

        title: apiData.title,
        address: apiData.address || "",

        meter: apiData.area?.toString() ?? "",
        suitableFor: apiData.suitableFor?.toString() || "",
        numberOfRooms: apiData.numRooms?.toString() ?? "",
        constructionYear: apiData.constructionYear,
        capacity: apiData.capacity?.toString() ?? "",
        province: apiData.province,
        city: apiData.city,
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

        comments: (apiData.reviews || []),

        user: {
            id: apiData.owner.userId as number || 0,
            firstName: apiData.owner.name?.split(" ")[0] || "",
            lastName: apiData.owner.name?.split(" ").slice(1).join(" ") || "",
            phoneNumber: apiData.owner.phone || "",
            nationalCode: "",
            birthDate: "",
            description: apiData.owner.description || "",
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
