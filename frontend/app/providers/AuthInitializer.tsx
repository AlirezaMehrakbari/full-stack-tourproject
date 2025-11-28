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
                    id: res.data._id,
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    phoneNumber: res.data.phoneNumber,
                    role: res.data.role,
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
