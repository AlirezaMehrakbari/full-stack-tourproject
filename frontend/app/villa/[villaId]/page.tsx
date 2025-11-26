'use client';
import {useQuery} from '@tanstack/react-query';
import {tripTourApi} from '@/axios-instances';
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

    // هوک useStep باید قبل از هر return یا شرط اجرا شود
    const step = useStep();

    // گرفتن اطلاعات ویلا با React Query
    const {data, isLoading, isError} = useQuery({
        queryKey: ['villaDetails', villaId],
        queryFn: async () => {
            const villa = await getVillaDetail(villaId);
            return mapVillaDataToFront(villa);
        },
    });
    console.log(data)

    // حالت‌های لودینگ، خطا و عدم داده
    if (isLoading) return <Loading/>;
    if (isError) return <p>Something went wrong!</p>;
    if (!data) return <p>Not Found!</p>;
console.log(step)
    // تعیین بخش نمایش بر اساس step فعلی
    const getSectionComponent = () => {
        // هر تغییر در step باعث scroll به بالا می‌شود
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
