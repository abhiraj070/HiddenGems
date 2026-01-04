"use client"

import { useRouter } from "next/navigation"

export default function SpotDetailsModal({ onClose, review }) {
  const router= useRouter()
  //console.log("creating detail box")
  const handleProfileClick=(Id)=>{
    router.push(`/profile/${Id}`)
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
