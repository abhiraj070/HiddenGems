"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
export default function SidebarComponent({
  selectedCategories,
  setDisplayFavBox,
  isSpotLiked,
  displayFavBox,
  likedlength,
  setLikedLength
}) {
  const categories = [
    { id: "cafe", name: "Cafe" },
    { id: "hotel", name: "Hotel" },
    { id: "restaurant", name: "Restaurant"},
    { id: "homestay", name: "Homestay"},
    { id: "hostel", name: "Hostel" },
    { id: "library", name: "Library"},
    { id: "viewpoint", name: "Viewpoint" },
    { id: "dhaba", name: "Dhaba" },
    { id: "nature", name: "Nature" },
    { id: "food", name: "Food" },
    { id: "culture", name: "Culture" },
    { id: "adventure", name: "Adventure" },
    { id: "city", name: "City"},
    { id: "others", name: "Others" }
  ]
  const [expandedCategories, setExpandedCategories] = useState(false)
  const [error, setError]= useState(null)

  const handleCategoryToggle = (categoryId) => {
    
  }

  const isSelected = (categoryId) => {
  }

  useEffect(()=>{
    const fetchlikes= async()=>{
      try {
        const res= await axios.get(
        `/api/v1/like/get/likes`
      )
        setError(null)
        setLikedLength(res.data.data.number)
      } catch (error) {
        setError(error.message)
      }
    
    }
    fetchlikes()
  },[isSpotLiked])

  const onShowFavorites=()=>{
    setDisplayFavBox(!displayFavBox)
  }
  
  return (
    <div
      className="
        fixed left-2 top-23 bottom-3 w-85 z-20
        rounded-3xl
        bg-white/85 backdrop-blur
        border border-stone-300/60
        shadow-[0_25px_60px_-30px_rgba(0,0,0,0.45)]
        flex flex-col
      "
      style={{
        fontFamily: "Inter, Arial, sans-serif"
      }}
    >

      <div className="px-6 py-6">
        <h2 className="text-xl font-semibold text-stone-800 tracking-tight">
          Discover
        </h2>
        <p className="text-sm text-stone-500 mt-1">
          Explore places around you
        </p>
      </div>

      <div className="mx-4 mb-4 bg-white rounded-xl shadow-lg overflow-hidden border border-stone-200">
        <button
          onClick={() => setExpandedCategories(!expandedCategories)}
          className="w-full flex items-center justify-between px-5 py-4 text-m font-semibold text-stone-800 hover:bg-stone-100 transition"
        >
          <span>Filter Locations</span>
          <span className="text-xs text-stone-500">
            {expandedCategories ? "▲" : "▼"}
          </span>
        </button>

        {expandedCategories && (
          <div className="px-3 pb-3 max-h-56 overflow-y-auto">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-stone-100 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={isSelected(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                  className="w-4 h-4 accent-stone-700"
                />

                <div className="w-9 h-9 rounded-lg bg-stone-200 flex items-center justify-center shrink-0">
                  {/* image / svg here */}
                </div>

                <span className="text-sm font-medium text-stone-800">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1" />
      <div className="mx-4 mb-6 space-y-3">
        <Link
          href={`/profile`}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-xl bg-white hover:bg-stone-100 transition shadow-lg border border-stone-200"
        >
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-stone-800">
              Saved
            </p>
            <p className="text-xs text-stone-500">
              Places you bookmarked
            </p>
          </div>
          <span className="text-lg"><svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
          </svg>
          </span>
        </Link>

        <button
          onClick={() => onShowFavorites()}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-xl bg-white hover:bg-stone-100 transition shadow-lg border border-stone-200"
        >
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-stone-800">
              Liked
            </p>
            <p className="text-xs text-stone-500">
              Places you love
            </p>
          </div>
          <span className="text-xs font-semibold text-stone-700 bg-stone-200 px-2 py-1 rounded-full">
            {likedlength}
          </span>
          <span className="text-2xl leading-none">♡</span>
        </button>
      </div>
    </div>
)}