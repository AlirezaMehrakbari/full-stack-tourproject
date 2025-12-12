"use client";

import React from "react";
import {useRouter} from "next/navigation";
import {useDeleteVilla, useGetMyVillas} from "@/app/components/admin/_hooks/useVillas";
import Button from "@/app/components/Button";

const ResidencesPage: React.FC = () => {
    const router = useRouter();

    const {data: villas, isLoading} = useGetMyVillas();
    const deleteVilla = useDeleteVilla();

    if (isLoading)
        return (
            <p className="text-gray-600 text-center py-10">
                در حال بارگذاری اقامتگاه‌ها...
            </p>
        );

    return (
        <div className="max-md:w-[90%] w-[70%] mx-auto py-10 space-y-10">

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">اقامتگاه‌های من</h2>

                <Button
                    onClick={() => router.push("villa")}
                    className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md"
                >
                    + افزودن ویلا
                </Button>
            </div>

            {(!villas || villas.length === 0) && (
                <p className="text-center text-gray-500 text-lg">
                    هنوز هیچ ویلایی ثبت نکرده‌اید.
                </p>
            )}

            <div className="space-y-6">
                {villas?.map((villa) => (
                    <div
                        key={villa.id}
                        className="flex max-md:flex-col items-center gap-5 bg-white border shadow-sm rounded-xl p-4"
                    >
                        <img
                            src={villa.images?.[0] || "/no-image.jpg"}
                            className="w-40 h-28 max-md:w-full max-md:h-60 rounded-lg object-cover"
                            alt={""}/>

                        <div className="flex justify-between max-md:flex-col items-start w-full">
                            {/* اطلاعات */}
                            <div className="space-y-1">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {villa.title}
                                </h3>

                                <p className="text-gray-600">
                                    {villa.city}، {villa.province}
                                </p>

                                <p className="text-blue-600 font-medium">
                                    قیمت: {villa.pricePerNight.toLocaleString()} ریال
                                </p>
                            </div>

                            <div className="flex flex-col max-md:flex-row max-md:mx-auto max-md:pt-4 gap-3">

                                <Button
                                    onClick={() =>
                                        router.push(`villa?id=${villa.id}`)
                                    }
                                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                                >
                                    ویرایش
                                </Button>

                                <Button
                                    onClick={() => {
                                        if (confirm("آیا از حذف این ویلا مطمئن هستید؟")) {
                                            deleteVilla.mutate(villa.id);
                                        }
                                    }}
                                    className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg"
                                >
                                    حذف
                                </Button>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResidencesPage;
