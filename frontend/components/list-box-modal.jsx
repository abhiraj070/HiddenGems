"use client"
import { useEffect, useState } from "react"
import axios from "axios"

export default function ListBoxModal({ onClose, allReviews, setShowDetails, setTransferSpecificReview, coordOfSpot, setIsSpotLiked, isSpotLiked, onAddReviewClick }) {
  //console.log("allReviews: ",allReviews);
  //console.log(("set: ",allReviews[0].reviews));
  //console.log("cod:",coordOfSpot);
  
  const [turnblue, setTurenBlue]= useState(false)
  const [turnred, setTurnRed]= useState(false)
  const [likenumber, setlikenumber]= useState(0)
  const [error, setError]= useState(null)

  useEffect(()=>{
    const fetchIsSavedLiked=async ()=>{
      try {
        const res= await axios.get(
          `/api/v1/users/check/${coordOfSpot.lat}/${coordOfSpot.lng}/null/Spot`
        )
        //console.log("res: ",res.data.data);
        setlikenumber(res.data.data.target.likes)
        setTurnRed(res.data.data.likeresult)
        setTurenBlue(res.data.data.savedresult)
        setError(null)
      } catch (error) {
        setError(error.message)
      }
    }
    fetchIsSavedLiked()
  },[allReviews])

  const handleReviewClick= (val)=>{
    setShowDetails(true)
    setTransferSpecificReview(val)
  }
  const handleLike=async()=>{
      try {
        const res= await axios.post(
          `/api/v1/like/toggleLike/${coordOfSpot.lat}/${coordOfSpot.lng}/null/Spot`,
          { withCredentials: true }
        )
        //console.log("res:",res);
        setError(null)
        setIsSpotLiked(!isSpotLiked)
        setlikenumber(res.data.data.spot.likes)
        setTurnRed(!turnred)
      } catch (error) {
        setError(error.message)
      }    
  }
  const handleSave= async ()=>{
      try {
        await axios.post(
          `/api/v1/savedSpot/toggleSave/${coordOfSpot.lat}/${coordOfSpot.lng}`
        )
        setError(null)
        setTurenBlue(!turnblue)
      } catch (error) {
        setError(error.message)
      }
  }

  if(!allReviews){ //due to this, if we didn't recive allreviews the box will be blank
    return null
  }
  return (
    <div className="fixed top-50 right-50 z-50 w-80 rounded-xl bg-white shadow-2xl border border-gray-200 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b
                      bg-linear-to-r from-gray-50 to-gray-100 rounded-t-xl">
        <h3 className="text-lg font-semibold text-gray-800 tracking-wide">
          {allReviews.spotName[0].toUpperCase()+allReviews.spotName.slice(1)} Tags
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
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {allReviews.reviews.map((val) => (
          <div
            key={val._id}
            onClick={() => handleReviewClick(val)}
            className="
              p-3 rounded-lg border border-gray-100
              hover:border-gray-300 hover:bg-gray-50
              transition cursor-pointer
              flex items-center justify-between
            "
          >
            <div>
              <p className="text-m font-medium text-gray-800">
                {val.tag[0].toUpperCase() + val.tag.slice(1)}
              </p>
              <p className="text-xs text-gray-500">
                Click to view details
              </p>
            </div>

            <div className="flex items-center gap-6">
              <button className="flex items-center text-gray-600 hover:text-red-600 transition">
                <span className="flex items-center justify-center h-8 w-8 rounded-full">
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
                      d="M21 8.25c0-2.485-2.099-4.5-4.687-4.5
                        -1.935 0-3.597 1.126-4.313 2.733
                        -.716-1.607-2.378-2.733-4.313-2.733
                        C5.1 3.75 3 5.765 3 8.25
                        c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </span>

                <span className="text-sm text-gray-500">
                  {val.likes || 0}
                </span>
              </button>

              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
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

                <span className="text-sm text-gray-500">
                  {val.comments.length}
                </span>
              </button>

            </div>
          </div>
        ))}
      </div>



      <div className="flex items-center justify-between px-5 py-3 border-t bg-gray-50 rounded-b-xl">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg
                    ${turnred? "border bg-red-100 border-red-400 text-red-600":
                    "border border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600"}`}
        >
          <span className="text-2xl leading-none">♡</span>
          <span className="text-sm font-semibold text-stone-700  px-2 py-1 rounded-full">
            {likenumber || 0 }
          </span>
        </button>

        <button
          onClick={onAddReviewClick}
          className="
            px-4 py-2.5 rounded-xl
            bg-green-600 text-white hover:bg-green-700
            font-semibold
            shadow-md
            transition-all duration-150
            hover:shadow-lg hover:scale-[1.03]
            active:scale-100
          "
        >
          + Add Review
        </button>

        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg
                    border
                    ${turnblue? 
                     "bg-blue-100 border-blue-300 text-blue-500" :
                    "hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 border-gray-300 text-gray-700"}`}
        >
          <span className="text-lg"><svg
            viewBox="0 0 24 24"
            fill={turnblue ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-5 text-current"
          >
            <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
          </svg>
        </span>
        </button>
      </div>
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
