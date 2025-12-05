import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PassengerInfo {
    id: number;
    firstName: string;
    lastName: string;
    nationalId: string;
    nationality: string;
    gender: 'زن' | 'مرد';
    birthDate: string;
    passportNumber: string;
    passportExpiry: string;
}

interface PassengersCount {
    adult1: number;
    adult2: number;
    childFrom2to12: number;
    child2: number;
}

interface BookingState {
    travelDate: string;
    passengers: PassengersCount;
    passengersInfo: PassengerInfo[];
    totalPrice: number;
}

const initialState: BookingState = {
    travelDate: 'تاریخ سفر را مشخص کنید',
    passengers: {
        adult1: 0,
        adult2: 0,
        childFrom2to12: 0,
        child2: 0
    },
    passengersInfo: [],
    totalPrice: 0
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setTravelDate: (state, action: PayloadAction<string>) => {
            state.travelDate = action.payload;
        },
        setPassengers: (state, action: PayloadAction<PassengersCount>) => {
            state.passengers = action.payload;
        },
        incrementPassenger: (state, action: PayloadAction<keyof PassengersCount>) => {
            state.passengers[action.payload] += 1;
        },
        decrementPassenger: (state, action: PayloadAction<keyof PassengersCount>) => {
            if (state.passengers[action.payload] > 0) {
                state.passengers[action.payload] -= 1;
            }
        },
        addPassengerInfo: (state, action: PayloadAction<PassengerInfo>) => {
            const existingIndex = state.passengersInfo.findIndex(p => p.id === action.payload.id);
            if (existingIndex !== -1) {
                state.passengersInfo[existingIndex] = action.payload;
            } else {
                state.passengersInfo.push(action.payload);
            }
        },
        updatePassengerInfo: (state, action: PayloadAction<{ id: number; data: Partial<PassengerInfo> }>) => {
            const passenger = state.passengersInfo.find(p => p.id === action.payload.id);
            if (passenger) {
                Object.assign(passenger, action.payload.data);
            }
        },
        removePassengerInfo: (state, action: PayloadAction<number>) => {
            state.passengersInfo = state.passengersInfo.filter(p => p.id !== action.payload);
        },
        setTotalPrice: (state, action: PayloadAction<number>) => {
            state.totalPrice = action.payload;
        },
        clearBooking: (state) => {
            state.travelDate = 'تاریخ سفر را مشخص کنید';
            state.passengers = {
                adult1: 0,
                adult2: 0,
                childFrom2to12: 0,
                child2: 0
            };
            state.passengersInfo = [];
            state.totalPrice = 0;
        },
        resetBooking: () => initialState
    }
});

export const {
    setTravelDate,
    setPassengers,
    incrementPassenger,
    decrementPassenger,
    addPassengerInfo,
    updatePassengerInfo,
    removePassengerInfo,
    setTotalPrice,
    clearBooking,
    resetBooking
} = bookingSlice.actions;

export default bookingSlice.reducer;
