'use client'
import React, { useState } from 'react'
import Logo from "@/app/components/navbar/Logo";
import Button from "@/app/components/Button";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Timer from "@/app/components/modals/Timer";
import { useMutation } from '@tanstack/react-query'
import { useAppDispatch } from "@/app/redux/store";
import { logIn } from "@/app/redux/slices/user-slice";
import { tripTourApi } from "@/axios-instances";

type Inputs = {
    phoneNumber: string,
    digit1: string,
    digit2: string,
    digit3: string,
    digit4: string,
    firstName: string,
    lastName: string
}

const RegisterModal = () => {
    const registerModal = useRegisterModal()
    const dispatch = useAppDispatch()

    const [phoneNumber, setPhoneNumber] = useState<string>("")
    const [step, setStep] = useState(0)
    const [userExists, setUserExists] = useState<boolean>(false)
    const [verificationCodeExpired, setVerificationCodeExpired] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(false)

    const { register, handleSubmit, reset, setFocus } = useForm<Inputs>()

    const enterPhoneMutation = useMutation({
        mutationFn: (phone: string) =>
            tripTourApi.post('/auth/enter-phoneNumber', { phoneNumber: phone }),
        onSuccess: (res) => {
            setUserExists(res.data.userExists)
            toast.success('کد تایید ارسال شد')
            setStep(1)
        },
        onError: () => toast.error('خطا در ارسال شماره')
    })

    const verifyMutation = useMutation({
        mutationFn: (body: { phoneNumber: string, code: string }) =>
            tripTourApi.post('/auth/phoneNumber-verification', body),
        onError: () => toast.error('کد تایید اشتباه است')
    })

    const loginMutation = useMutation({
        mutationFn: (phone: string) =>
            tripTourApi.post('/auth/login', { phoneNumber: phone }),
        onError: () => toast.error('ورود ناموفق')
    })

    const registerMutation = useMutation({
        mutationFn: (body: any) =>
            tripTourApi.post('/auth/register', body),
        onError: () => toast.error('ثبت نام ناموفق')
    })

    const handleFirstStep: SubmitHandler<Inputs> = (data) => {
        const regexPhone = /^(9\d{9})$/
        if (!regexPhone.test(data.phoneNumber)) {
            toast.error('شماره موبایل معتبر نیست.')
            return
        }
        const fullPhone = `0${data.phoneNumber}`
        setPhoneNumber(fullPhone)
        setIsLoading(true)
        enterPhoneMutation.mutate(fullPhone, {
            onSettled: () => {
                setIsLoading(false)
                reset()
            }
        })
    }

    const handleSecondStep: SubmitHandler<Inputs> = async (data) => {
        const code = data.digit1 + data.digit2 + data.digit3 + data.digit4
        setIsLoading(true)
        verifyMutation.mutate(
            { phoneNumber, code },
            {
                onSuccess: async () => {
                    if (userExists) {
                        const loginRes = await loginMutation.mutateAsync(phoneNumber)
                        localStorage.setItem('token', loginRes.data.token)
                        dispatch(logIn({
                            id: loginRes.data.user._id,
                            firstName: loginRes.data.user.firstName,
                            lastName: loginRes.data.user.lastName,
                            phoneNumber: loginRes.data.user.phoneNumber,
                            role: loginRes.data.user.role,
                            token: loginRes.data.token,
                        }))
                        toast.success("خوش آمدید")
                        registerModal.onClose()
                        setStep(0)
                        reset()
                        setIsLoading(false)
                    } else {
                        toast.success("لطفا مشخصات خود را تکمیل کنید")
                        setStep(2)
                        setIsLoading(false)
                    }
                },
                onSettled: () => reset()
            }
        )
    }

    const handleThirdStep: SubmitHandler<Inputs> = (data) => {
        setIsLoading(true)
        registerMutation.mutate(
            {
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber,
                role: 'user'
            },
            {
                onSuccess: (res) => {
                    localStorage.setItem('token', res.data.token)
                    dispatch(logIn({
                        id: res.data.user._id,
                        firstName: res.data.user.firstName,
                        lastName: res.data.user.lastName,
                        phoneNumber: res.data.user.phoneNumber,
                        role: res.data.user.role,
                        token: res.data.token,
                    }))
                    toast.success("ثبت نام موفق")
                    registerModal.onClose()
                    setStep(0)
                },
                onSettled: () => {
                    setIsLoading(false)
                    reset()
                }
            }
        )
    }

    let content

    if (step === 0) {
        content = (
            <form onSubmit={handleSubmit(handleFirstStep)}
                  className='flex flex-col items-center py-12 w-[45%] mx-auto'>
                <Logo width={'w-full'} />
                <h2 className='text-[21.5px] font-kalameh500 pt-12'>عضویت در تریپ تور</h2>
                <p className='text-[14px] pt-2 text-[#000]'>برای ورود شماره همراه خود را وارد کنید</p>

                <div className='flex items-center justify-end bg-[#EDECEC] py-3 rounded-[5px] mt-4 w-full'>
                    <input
                        className='bg-transparent outline-0 pl-4'
                        type='number'
                        placeholder='9XXXXXXXXX'
                        {...register('phoneNumber', { required: true })}
                        inputMode='tel'
                        disabled={isLoading}
                        dir='ltr'
                    />
                    <p className='border-r-[1px] px-4 text-[18px]'>98</p>
                </div>

                <Button type='submit' disabled={isLoading}
                        styles='w-full text-[20px] font-kalameh700 rounded-[5px] py-6 mt-3'>
                    {isLoading ? <span className="loading loading-ring loading-md"></span> : 'ادامه'}
                </Button>
            </form>
        )
    }

    if (step === 1) {
        content = (
            <form onSubmit={handleSubmit(handleSecondStep)}
                  className='flex flex-col items-center py-12 w-[45%] mx-auto'>
                <h2 className='text-[21.5px] font-kalameh500 pt-12'>تایید شماره موبایل</h2>
                <p className='text-[14px] pt-2 text-[#000]'>کد ۴ رقمی ارسال شده را وارد کنید</p>

                <div className='flex items-center justify-between bg-[#EDECEC] py-3 px-4 rounded-[5px] mt-4 w-full'>
                    <button type='button'
                            className='text-[14px] text-[#979797]'
                            onClick={() => setStep(0)}>
                        ویرایش شماره
                    </button>
                    <p className='text-[14px] text-[#979797]'>{phoneNumber}</p>
                </div>

                <div className='flex items-center justify-between py-2' dir='ltr'>
                    <input maxLength={1}
                           className='w-[20%] text-center bg-[#EDECEC] px-2 py-3 rounded-[5px]'
                           {...register('digit1', { required: true })}
                           onChange={(e) => e.target.value && setFocus('digit2')}
                    />
                    <input maxLength={1}
                           className='w/[20%] text-center bg-[#EDECEC] px-2 py-3 rounded-[5px]'
                           {...register('digit2', { required: true })}
                           onChange={(e) => e.target.value && setFocus('digit3')}
                    />
                    <input maxLength={1}
                           className='w/[20%] text-center bg-[#EDECEC] px-2 py-3 rounded-[5px]'
                           {...register('digit3', { required: true })}
                           onChange={(e) => e.target.value && setFocus('digit4')}
                    />
                    <input maxLength={1}
                           className='w/[20%] text-center bg-[#EDECEC] px-2 py-3 rounded-[5px]'
                           {...register('digit4', { required: true })}
                    />
                </div>

                <div className='py-2 text-[12px]'>
                    {verificationCodeExpired
                        ? <button type='button'>ارسال مجدد کد</button>
                        : <Timer minute={2} second={0} expired={setVerificationCodeExpired} />
                    }
                </div>

                <Button type='submit' disabled={isLoading}
                        styles='w-full text-[20px] font-kalameh700 rounded-[5px] py-6'>
                    {isLoading ? <span className="loading loading-ring loading-md"></span> : 'ادامه'}
                </Button>
            </form>
        )
    }

    if (step === 2) {
        content = (
            <form onSubmit={handleSubmit(handleThirdStep)}
                  className='flex flex-col items-center py-12 w/[45%] mx-auto'>
                <h2 className='text-[21.5px] font-kalameh500 pt-12'>مشخصات شخصی</h2>
                <p className='text-[14px] pt-2 text-[#000]'>لطفا مشخصات خود را وارد کنید</p>

                <div className='flex flex-col w-full gap-y-2 py-2'>
                    <input placeholder='نام'
                           className='bg-[#EDECEC] px-2 py-3 rounded-[5px]'
                           {...register('firstName', { required: true })}
                    />
                    <input placeholder='نام خانوادگی'
                           className='bg-[#EDECEC] px-2 py-3 rounded/[5px]'
                           {...register('lastName', { required: true })}
                    />
                </div>

                <Button type='submit' disabled={isLoading}
                        styles='w-full text/[20px] font-kalameh700 rounded/[5px] mt-10 py-6'>
                    {isLoading ? <span className="loading loading-ring loading-md"></span> : 'ادامه'}
                </Button>
            </form>
        )
    }

    return (
        <div className={`${registerModal.isOpen ? 'block' : 'hidden'} fixed bg-neutral-800/70 inset-0 flex justify-center items-center z-50`}>
            <div className='relative w/[90%] md:w/[60%] lg:w/[40%] bg-white rounded/[5px]'>

                <button
                    onClick={() => {
                        registerModal.onClose()
                        setStep(0)
                        reset()
                    }}
                    className='absolute left-6 top-6 bg-red-500 text-white rounded px-2 py-1'>
                    ✕
                </button>

                {content}
            </div>
        </div>
    )
}

export default RegisterModal
