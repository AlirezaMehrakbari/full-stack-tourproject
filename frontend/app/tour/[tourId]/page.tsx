'use client'
import React, {useEffect} from 'react'
import TourDetail from "@/app/components/tour/TourDetail";
import useStep from "@/app/hooks/useStep";
import Passengers from "@/app/components/process/Passengers";
import ConfirmInformation from "@/app/components/process/ConfirmInformation";
import PaymentDetail from "@/app/components/process/PaymentDetail";
import Receipt from "@/app/components/process/Receipt";
import {useQuery} from "@tanstack/react-query";
import {getTourById} from "@/app/tour/_api/tourApis";
import Loading from "@/app/components/Loading";
import {Tour} from "@/app/tour/_types/tourTypes";
import SelectDropDown from "@/app/components/dropDown/SelectDropDown";
import Button from "@/app/components/Button";

const TourDetailPage = ({params}: { params: { tourId: string } }) => {
    // const step = useAppSelector(state=>state.stepSlice.step)
    // const dispatch = useAppDispatch()
    const tourId = params.tourId;
    const {data: tourInfo, isError, isLoading} = useQuery<Tour>({
        queryKey: ['tourInfo'],
        queryFn: () => getTourById(tourId)
    })
    const step = useStep()
    useEffect(() => {
        // dispatch(resetStep())
        step.resetStep()
    }, [])
    if (isLoading) return <Loading/>;
    if (isError) return <p>Something went wrong!</p>;
    if (!tourInfo) return <p>Not Found!</p>;
    const getSectionComponent = () => {
        window.scrollTo(0, 0)
        switch (step.step) {
            case 0 :
                return <TourDetail data={tourInfo}/>
            case 1 :
                return <Passengers data={tourInfo}/>
            case 2 :
                return <ConfirmInformation tourDetails={tourInfo}/>
            case 3 :
                return <PaymentDetail tourDetails={tourInfo}/>
            case 4 :
                return <Receipt tourDetails={tourInfo}/>
        }
    }

    return getSectionComponent()
}

export default TourDetailPage
