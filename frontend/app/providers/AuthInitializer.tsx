"use client"

import { useEffect } from "react"
import { useAppDispatch } from "@/app/redux/store"
import { logIn, logOut } from "@/app/redux/slices/user-slice"
import { tripTourApi } from "@/axios-instances"

export default function AuthInitializer() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) return

        tripTourApi.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                dispatch(logIn({
                    id: res.data.user._id,
                    firstName: res.data.user.firstName,
                    lastName: res.data.user.lastName,
                    phoneNumber: res.data.user.phoneNumber,
                    role: res.data.user.role,
                    token
                }))
            })
            .catch(() => {
                localStorage.removeItem("token")
                dispatch(logOut())
            })
    }, [])

    return null
}
