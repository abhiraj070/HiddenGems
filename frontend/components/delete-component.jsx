"use client"

import axios from "axios"

export default function DeleteComponent({setConfirmDelete, setShowPopUp, deleteReviewId, deleteSavedId}){
    const onConfirm=async ()=>{
        if(deleteReviewId){
            const res= await axios.post(
                `/api/v1/users/delete/review/${deleteReviewId}`
            )
            
        }
        else if(deleteSavedId){
            const res= await axios.post(
                `/api/v1/users/delete/saved/${deleteSavedId}`
            )
        }
        setConfirmDelete(true)
        setShowPopUp(false)
    }
    const onCancel=()=>{
        setConfirmDelete(false)
        setShowPopUp(false)
    }
    return(
        <div className="
        fixed bottom-4
        left-1/2 -translate-x-1/2
        w-full max-w-2xl
        h-14
        px-6
        flex items-center justify-between
        z-50
        bg-white
        border border-stone-300
        rounded-xl
        shadow-lg
        ">
        <span className="text-sm font-medium text-stone-800">
            Are you sure?
        </span>

        <div className="flex gap-3">
            <button
            onClick={onConfirm}
            className="
                px-4 py-1.5
                bg-red-600 text-white text-sm
                rounded-md
                hover:bg-red-700
                transition
            "
            >
            Yes
            </button>

            <button
            onClick={onCancel}
            className="
                px-4 py-1.5
                border border-stone-300 text-sm
                rounded-md
                hover:bg-stone-100
                transition
            "
            >
            No
            </button>
        </div>
        </div>
    )
}