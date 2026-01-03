"use client"
import { useEffect, useRef, useState } from "react"
import axios from "axios"

export default function ListBoxModal({ onClose, allReviews, setShowDetails, setTransferSpecificReview, coordOfSpot }) {
  //console.log("allReviews: ",allReviews);
  //console.log(("set: ",allReviews[0].reviews));
  const [turnblue, setTurenBlue]= useState(false)
  const [turnred, setTurnRed]= useState(false)
  useEffect(()=>{
    const fetchIsSavedLiked=async ()=>{
      const res= await axios.get(
        `/api/v1/users/check/${coordOfSpot.lat}/${coordOfSpot.lng}`
      )
      const res2= await axios.get(
        `/api/v1/users/check/liked/${coordOfSpot.lat}/${coordOfSpot.lng}`
      )
      //console.log("res: ",res.data.data);
      setTurnRed(res2.data.data)
      setTurenBlue(res.data.data)
    }
    fetchIsSavedLiked()
  },[])

  const handleReviewClick= (val)=>{
    setShowDetails(true)
    setTransferSpecificReview(val)
  }
  const handleLike=async(id)=>{
    if(!turnred){
      const res= await axios.post(
        `/api/v1/users/favSpot/${coordOfSpot.lat}/${coordOfSpot.lng}`
      )
    }
    else{
      const res2= await axios.post(
        `/api/v1/users/removeliked/${coordOfSpot.lat}/${coordOfSpot.lng}`
      )
    }
    
    setTurnRed(!turnred)
  }
  const handleSave= async ()=>{
    if(!turnblue){
      const res= await axios.post(
        `/api/v1/users/saveSpot/${coordOfSpot.lat}/${coordOfSpot.lng}`
      )
      //console.log("res save: ",res);
    } 
    else{
      const res= await axios.post(
        `/api/v1/users/deletespot/${coordOfSpot.lat}/${coordOfSpot.lng}`
      )
      //console.log("res unsave: ",res);
    }
    setTurenBlue(!turnblue)
  }
  return (
    <div className="fixed top-50 right-50 z-50 w-80 rounded-xl bg-white shadow-2xl border border-gray-200 flex flex-col">
      <div className="flex items-center justify-between px-5 py-3 border-b
                      bg-linear-to-r from-gray-50 to-gray-100 rounded-t-xl">
        <h3 className="text-lg font-semibold text-gray-800 tracking-wide">
          Reviews
        </h3>

        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full
                    text-gray-500 hover:text-gray-800 hover:bg-gray-200
                    transition cursor-pointer"
        >
          ✕
        </button>
      </div>
      <div className="flex items-center justify-between px-5 py-3 border-b
                      bg-linear-to-r from-gray-50 to-gray-100 ">
        <h3 className="text-m font-semibold text-gray-800 tracking-wide">
          {allReviews[0].spotName[0].toUpperCase()+allReviews[0].spotName.slice(1)}
        </h3>
          
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {allReviews[0].reviews.map((val) => (
          <div
            key={val._id}
            onClick={() => handleReviewClick(val)}
            className="p-3 rounded-lg border border-gray-100
                      hover:border-gray-300 hover:bg-gray-50
                      transition cursor-pointer"
          >
            <p className="text-m font-medium text-gray-800">
              {val.tag[0].toUpperCase() + val.tag.slice(1)}
            </p>
            <p className="text-xs text-gray-500">
              Click to view details
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-5 py-3 border-t bg-gray-50 rounded-b-xl">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg
                    ${turnred? "border bg-red-50 border-red-400 text-red-600":
                    "border border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600"}`}
        >
          <span className="text-2xl leading-none">♡</span>
          <span className="text-xs font-semibold text-stone-700  px-2 py-1 rounded-full">
            {/* {val.favourite.length} */}
          </span>
        </button>

        <button
          onClick={handleSave}

          className={`flex items-center gap-2 px-4 py-2 rounded-lg
                    border
                    ${turnblue? 
                     "bg-blue-50 border-blue-300 text-blue-500" :
                    "hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 border-gray-300 text-gray-700"}`}
        >
          <span className="text-lg"><svg
            viewBox="0 0 24 24"
            fill={turnblue ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-current"
          >
            <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
          </svg>
        </span>
        </button>
      </div>
    </div>
  );
}
