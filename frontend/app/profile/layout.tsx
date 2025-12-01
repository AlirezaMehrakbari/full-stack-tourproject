import type {Metadata} from 'next'
import ProfileNavbar from "@/app/components/profile/ProfileNavbar";
import Sidebar from "@/app/components/profile/Sidebar";

export const metadata: Metadata = {
    title: 'پروفایل کاربری',
}

export default function ProfileLayout({
                                          children,
                                      }: {
    children: React.ReactNode
}) {
    return (
        <section>
            <ProfileNavbar/>
            <div className='grid overflow-hidden grid-cols-1 items-start lg:grid-cols-4 px-4'>
                <div
                    className={'flex items-center justify-center col-span-1'}
                >
                    <Sidebar/>
                </div>
                <div
                    className={'col-span-3 max-lg:pt-8'}
                >
                    {children}
                </div>
            </div>
        </section>

    )
}
