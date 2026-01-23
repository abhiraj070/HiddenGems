"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import axios from "axios"

export default function SpotDetailsModal({ onClose, reviewInherit }) {
  const [turnred, setTurnRed]= useState(false)
  const [review, setReview]= useState(null)
  const router= useRouter()
  //console.log("creating detail box")
  //console.log("review: ",review);
  
  useEffect(()=>{
    setReview(reviewInherit)
  },[])

  useEffect(()=>{
    //console.log("2");
    if (!review) return
    //console.log("1");
    
    const fetchIsLiked= async ()=>{
      const res= await axios.get(
        `/api/v1/users/check/null/null/${review._id}/Review`
      )
      //console.log("res: ",res);
      setTurnRed(res.data.data.likeresult)
    }
    fetchIsLiked()
  },[review])

  //here the flow of the useEffects are intersting: first each effect will run sequentially, but after the 1st effect rerender will not be triggered because then 2nd effect will never run, so in react all the effects runs first then the rerender takes place.

  const handleProfileClick=(Id)=>{
    router.push(`/profile/${Id}`)
  }

  const handleLike= async()=>{
    setTurnRed(!turnred)
    const res= await axios.post(
      `/api/v1/like/toggleLike/null/null/${review._id}/Review`
    )
    setReview(res.data.data.review)
  }
  const handleCommentOpen=()=>{

  }
  if(!review){
    return null
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-[90%] max-w-2xl rounded-2xl bg-white shadow-2xl p-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center
                     text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Review Details
        </h2>

        <div
          className="
            rounded-xl
            bg-gray-50
            border border-gray-200
            shadow-inner
            px-6 py-5
            space-y-5
          "
        >
          <div className="flex justify-between items-start border-b border-gray-200 pb-4">
            <p className="text-m text-gray-500">Tag: </p>
            <p className="px-3 py-1 rounded-full bg-gray-200 text-sm text-gray-700">
              {`${review.tag[0].toUpperCase()+review.tag.slice(1)}`}
            </p>
          </div>

          <div className="flex justify-between items-start border-b border-gray-200 pb-4">
            <p className="text-m text-gray-500">Spot Name:</p>
            <span className="text-m font-medium text-gray-800">
              {`${review.spotName[0].toUpperCase()+review.spotName.slice(1)}`}
            </span>
          </div>

          <div className="space-y-2 border-b border-gray-200 pb-4">
            <p className="text-m text-gray-500">Review:</p>
            <p className="text-gray-800 leading-relaxed">
              {`${review.content}`}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-m text-gray-500 whitespace-nowrap">
                Review's Owner:
            </p>

            <div className="flex items-center gap-3 cursor-pointer"
            onClick={()=>{handleProfileClick(review.owner._id)}}
            >
                <div
                    className="
                    h-10 w-10
                    rounded-full
                    border border-gray-300
                    bg-gray-200
                    overflow-hidden
                    flex items-center justify-center
                    "
                >
                    {review.owner.profilepicture ? (
                    <img
                        src={review.owner.profilepicture}
                        alt={review.owner.username}
                        className="h-full w-full object-cover"
                    />
                    ) : (
                    <span className="text-gray-600 text-m font-medium">
                        {review.owner.username?.[0]?.toUpperCase()}
                    </span>
                    )}
                </div>

                <p className="text-m font-medium text-gray-800">
                    {review.owner.username}
                </p>
                </div>
                
            </div>
            
        </div>
        <div
          className="
            flex items-center justify-between
            border-t border-gray-200
            pt-4
          "
        >
          <div className="flex items-center gap-6">
            
            <button
              onClick={handleLike}
              className="
                flex items-center 
                text-gray-600
                hover:text-red-600
                transition
              "
            >
              <span
                className={`
                  flex items-center justify-center
                  h-8 w-8
                  rounded-full
                 ${turnred ? "text-red-500" : " group-hover:bg-red-200"}
                  transition
                `}
              >
                
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={`${turnred? "currentColor":"none"}`}
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.687-4.5-1.935 0-3.597 1.126-4.313 2.733-.716-1.607-2.378-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
                
              </span>

              <span className="text-sm text-gray-500">
                {review.likes}
              </span>

            </button>

            <button
              onClick={handleCommentOpen}
              className="
                flex items-center gap-2
                text-gray-600
                hover:text-blue-600
                transition
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3h6m-6 6.75
                    1.5-1.5h9a2.25 2.25 0 002.25-2.25v-9
                    A2.25 2.25 0 0018 3H6
                    A2.25 2.25 0 003.75 5.25v9
                    A2.25 2.25 0 006 16.5h1.5z"
                />
              </svg>

              <span className="text-sm font-medium">
                Comment
              </span>

              <span className="text-sm text-gray-500">
                {review.commentsCount}
              </span>
            </button>

          </div>
        </div>

        <div
        className="
            mt-6
            flex items-center justify-between
            rounded-lg
            border border-gray-200
            bg-gray-100
            px-5 py-4
            hover:bg-gray-200
            transition
        "
        >
        <div className="flex flex-col">
            <p className="text-m font-medium text-gray-800">
              View Location
            </p>
            <p className="text-sm text-gray-500">
              Open this spot in Google Maps
            </p>
        </div>

        <a
            href={`https://www.google.com/maps?q=${review.latitude},${review.longitude}`}
            className="
            text-m font-medium
            text-blue-600
            hover:text-blue-700
            underline
            "
        >
            Open →
        </a>
        </div>
      </div>
    </div>
  )
}
