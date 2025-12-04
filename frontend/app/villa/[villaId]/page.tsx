'use client';
import {useQuery} from '@tanstack/react-query';
import Loading from '@/app/components/Loading';
import useStep from '@/app/hooks/useStep';
import VillaDetail from '@/app/components/villa/VillaDetail';
import ConfirmInformation from '@/app/components/process/ConfirmInformation';
import PaymentDetail from '@/app/components/process/PaymentDetail';
import Receipt from '@/app/components/process/Receipt';
import {mapVillaDataToFront} from '@/app/villa/_utils/mapVillaDataToFront';
import {getVillaDetail} from "@/app/villa/_api/getVillaDetail";

type VillaDetailPageProps = {
    params: {
        villaId: string;
    };
};

const VillaDetailPage = ({params}: VillaDetailPageProps) => {
    const villaId = params.villaId;

    const step = useStep();


    const {data, isLoading, isError} = useQuery({
        queryKey: ['villaDetails', villaId],
        queryFn: async () => {
            const villa = await getVillaDetail(villaId);
            return mapVillaDataToFront(villa);
        },
    });


    if (isLoading) return <Loading/>;
    if (isError) return <p>Something went wrong!</p>;
    if (!data) return <p>Not Found!</p>;

    const getSectionComponent = () => {

        window.scrollTo(0, 0);

        switch (step.step) {
            case 0:
                return <VillaDetail villaDetails={data}/>;
            case 2:
                return <ConfirmInformation villaDetails={data} isVilla/>;
            case 3:
                return <PaymentDetail villaDetails={data} isVilla/>;
            case 4:
                return <Receipt villaDetails={data} isVilla/>;
            default:
                return null;
        }
    };

    return getSectionComponent();
};

export default VillaDetailPage;
