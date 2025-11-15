import React, { useEffect, useState } from "react";
import axios from "axios";

type Review = {
    _id?: string;
    username: string;
    rating?: number;
    text: string;
    reply?: string;
    createdAt?: string;
};

type CommentsProps = {
    villaId: number; // شناسه ویلا برای ارتباط با API
    disabled?: boolean;
    reply?: boolean;
};

const Comments: React.FC<CommentsProps> = ({ villaId, disabled }) => {
    const [comments, setComments] = useState<Review[]>([]);
    const [comment, setComment] = useState("");

    // 📌 مرحله 1: گرفتن کامنت ها از API
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`/api/villas/${villaId}`);
                // فرض: API شامل reviews
                setComments(res.data.reviews || []);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };
        fetchComments();
    }, [villaId]);

    // 📌 مرحله 2: ارسال کامنت جدید به API
    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            const newReview = {
                user: "123", // یا id کاربر (در حالت واقعی از context)
                username: "کاربر تست", // نام کاربر از context/session
                rating: 5,
                text: comment,
            };

            const res = await axios.post(`/api/villas/${villaId}/review`, newReview);
            if (res.status === 201) {
                // اضافه کن بدون رفرش
                setComments((prev) => [...prev, res.data.review]);
                setComment("");
            }
        } catch (error) {
            console.error("Error adding review:", error);
        }
    };

    return (
        <div className="pb-8">
            {/* Header */}
            <div className="flex items-center gap-x-2">
                <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54 40" fill="none">
                    <path
                        d="M2 20.0989C2 20.0989 11.0922 2 27.0037 2C42.9151 2 52.0073 20.0989 52.0073 20.0989C52.0073 20.0989 42.9151 38.1979 27.0037 38.1979C11.0922 38.1979 2 20.0989 2 20.0989Z"
                        stroke="black"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M27.0035 26.8857C30.7696 26.8857 33.8227 23.847 33.8227 20.0986C33.8227 16.3502 30.7696 13.3115 27.0035 13.3115C23.2374 13.3115 20.1843 16.3502 20.1843 20.0986C20.1843 23.847 23.2374 26.8857 27.0035 26.8857Z"
                        stroke="black"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <h1 className="text-[20px] md:text-[39.8px] font-kalameh400">دیــدگاه ها</h1>
            </div>

            {/* Comments list */}
            {comments?.length > 0 && (
                <div
                    className={`relative bg-[#F7F6F6] p-4 ${
                        comments.length > 12 ? "h-[724px]" : "h-full"
                    } hover:overflow-y-auto overflow-hidden mt-8 rounded-[15px]`}
                >
                    <div className="w-full relative grid sm:grid-cols-2 justify-items-center">
                        <div className="hidden sm:block absolute w-[1px] bg-[#CFCFCF] h-full" />
                        {comments.map((item) => (
                            <div className="w-fit h-fit" key={item._id || item.text}>
                                <div className="flex items-center relative">
                                    {/* Avatar */}
                                    <div className="relative z-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="51" height="50" viewBox="0 0 51 50" fill="none">
                                            <circle cx="25.4374" cy="24.5731" r="24.1566" fill="#D9D9D9" stroke="white" strokeWidth="0.832988" />
                                        </svg>
                                        <svg
                                            className="absolute right-[14px] z-10 top-3"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="23"
                                            height="24"
                                            viewBox="0 0 23 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M21.4486 23.1774V20.6746C21.4486 19.347 20.9212 18.0738 19.9825 17.1351C19.0437 16.1963 17.7705 15.6689 16.4429 15.6689H6.43166C5.10409 15.6689 3.83088 16.1963 2.89214 17.1351C1.9534 18.0738 1.42603 19.347 1.42603 20.6746V23.1774"
                                                fill="#D9D9D9"
                                            />
                                            <path
                                                d="M21.4486 23.1774V20.6746C21.4486 19.347 20.9212 18.0738 19.9825 17.1351C19.0437 16.1963 17.7705 15.6689 16.4429 15.6689H6.43166C5.10409 15.6689 3.83088 16.1963 2.89214 17.1351C1.9534 18.0738 1.42603 19.347 1.42603 20.6746V23.1774"
                                                stroke="#030303"
                                                strokeWidth="1.24948"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M11.4373 10.6626C14.2018 10.6626 16.4429 8.42154 16.4429 5.65701C16.4429 2.89247 14.2018 0.651367 11.4373 0.651367C8.67274 0.651367 6.43164 2.89247 6.43164 5.65701C6.43164 8.42154 8.67274 10.6626 11.4373 10.6626Z"
                                                fill="#D9D9D9"
                                                stroke="#030303"
                                                strokeWidth="1.24948"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <p className="bg-orange text-white font-kalameh400 text-[12px] py-2 px-6 rounded-[8px] absolute right-10">
                                        {item.username || "کاربر ناشناس"}
                                    </p>
                                </div>

                                {/* Comment text */}
                                <div className="flex flex-row-reverse">
                                    <p className="whitespace-pre py-[35px] pr-10">{item.text}</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="4" height="112" viewBox="0 0 4 112" fill="none">
                                        <path
                                            d="M2.00586 0.0644113C1.10352 0.0644112 0.372029 0.795902 0.372028 1.69824C0.372028 2.60058 1.10352 3.33207 2.00586 3.33207C2.9082 3.33207 3.63969 2.60058 3.63969 1.69824C3.63969 0.795902 2.9082 0.0644113 2.00586 0.0644113ZM2.00585 111.3L3.77453 109.531L2.00585 107.762L0.237181 109.531L2.00585 111.3ZM1.69952 1.69824L1.69951 109.531L2.3122 109.531L2.3122 1.69824L1.69952 1.69824Z"
                                            fill="black"
                                        />
                                    </svg>
                                </div>

                                {/* Reply box (غیرفعال فعلاً) */}
                                <form className="relative">
                                    <input
                                        className="bg-[#5E5E5E] mb-16 placeholder:text-[26px] placeholder:font-kalameh500 px-4 py-3 rounded-[6px] text-white outline-none"
                                        placeholder="پاسخ شما"
                                    />
                                    <svg
                                        className="absolute top-[-0.7rem]"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="29"
                                        height="31"
                                        viewBox="0 0 29 31"
                                        fill="none"
                                    >
                                        <path
                                            d="M2.29379 18.7818C-0.369758 17.4149 -0.369757 13.6076 2.29379 12.2406L23.6514 1.27992C26.0977 0.0244675 29.006 1.80083 29.006 4.55049V26.4719C29.006 29.2216 26.0977 30.998 23.6514 29.7425L2.29379 18.7818Z"
                                            fill="#5E5E5E"
                                        />
                                    </svg>
                                </form>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Comment form */}
            <form
                onSubmit={handleAddComment}
                className="flex items-center justify-between bg-[#F7F6F6] px-8 mt-8 rounded-[15px] h-[108px]"
            >
        <textarea
            className="bg-[#F7F6F6] mt-8 outline-0 text-justify px-8 w-[80%]"
            placeholder="نـظرخــود را ثـبت کنیـد ..."
            disabled={disabled}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
        />
                <button type="submit" disabled={disabled}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="38" viewBox="0 0 40 38" fill="none">
                        <path
                            d="M13.5527 16.8524L19.3359 22.6084L38.6131 3.42188"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M36.6858 18.7708V32.2013C36.6858 33.2191 36.2796 34.1951 35.5566 34.9147C34.8335 35.6344 33.8529 36.0386 32.8303 36.0386H5.84226C4.81973 36.0386 3.83908 35.6344 3.11605 34.9147C2.39301 34.1951 1.98682 33.2191 1.98682 32.2013V5.34023C1.98682 4.32252 2.39301 3.34648 3.11605 2.62685C3.83908 1.90722 4.81973 1.50293 5.84226 1.50293H27.0472"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </form>

            {disabled && (
                <p className="text-[15px] font-kalameh500 py-2">برای ثبت نظرات خود باید حساب کاربری داشته باشید.</p>
            )}
        </div>
    );
};

export default Comments;
