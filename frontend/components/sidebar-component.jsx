"use client"

import { useEffect, useState } from "react"
import axios from "axios"

export default function SidebarComponent({
  setDisplayFavBox,
  isSpotLiked,
  displayFavBox,
  likedlength,
  setLikedLength,
  setSelected,
  selected,
  setApplyFilter,
  searchQuery,
  setSearchQuery,
  setQueryButton
}) {

  const categories = [
    { id: "cafe", name: "Cafe", icon: "/cafe.png" },
    { id: "hotel", name: "Hotel", icon: "/hotel.jpg" },
    { id: "restaurant", name: "Restaurant", icon: "/rest.png" },
    { id: "homestay", name: "Homestay", icon: "/hs.png" },
    { id: "hostel", name: "Hostel", icon: "/hostel.png" },
    { id: "library", name: "Library", icon: "/lib.jpg" },
    { id: "viewpoint", name: "Viewpoint", icon: "/vp.png" },
    { id: "dhaba", name: "Dhaba", icon: "/dhaba.png" },
    { id: "nature", name: "Nature", icon: "/nature.png" },
    { id: "food", name: "Food", icon: "/food.png" },
    { id: "culture", name: "Culture", icon: "/cultures.jpg" },
    { id: "adventure", name: "Adventure", icon: "/adv.png" },
    { id: "city", name: "City", icon: "/city.png" },
    { id: "others", name: "Others", icon: "/other.jpg" }
  ]

  
  //console.log("selected: ",selected);  
  //console.log("search",searchQuery);
  
  useEffect(() => {
    const fetchlikes = async () => {
      const res = await axios.get(`/api/v1/like/get/likes`)
      setLikedLength(res.data.data.number)
    }
    fetchlikes()
  }, [isSpotLiked])

  const toggleCategory = (id) => {
    setSelected(prev=> //prev is the array stored till now.
      prev.includes(id)? //includes checks if id exists in the array or not. it returns boolean.
      prev.filter(x=>x!==id): //select only those ids which which doesnot match the toggles category id. filter will return a new array and that will be stored in the selected
      [...prev,id] 
    )
  }
  //we use prev instead of the state variable cuz the reason....

  const handleApplyClick=()=>{
    setApplyFilter(true)
  }

  const handleSearchClick=()=>{
    setQueryButton(true)
  }

  return (
    <>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }`}
        </style>
    <aside className="
      fixed left-4 top-23.5 bottom-3 w-80
      rounded-3xl bg-white/75 backdrop-blur-xl
      border border-stone-200 shadow-2xl
      flex flex-col overflow-hidden
    ">

      <div className="px-6 pt-6 pb-4 border-b border-stone-200">
        <h2 className="text-xl font-bold text-stone-900">
          Explore Places
        </h2>
      </div>

 <form
      onSubmit={(e)=>{
        e.preventDefault()
        handleSearchClick()
      }}
    >
      <div className="px-5 py-5">
        <div className="relative">
          <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search Tag, Spotname or Review...."
          className="
            w-full px-4 py-3 pr-12 rounded-xl
            bg-stone-100 border border-stone-300
            text-sm

            transition-all duration-200 ease-out

            hover:bg-stone-50
            hover:border-stone-400

            focus:bg-white
            focus:border-teal-500
            focus:ring-4 focus:ring-teal-400/30
            focus:shadow-lg
            focus:scale-[1.01]

            active:scale-[0.99]

            outline-none
          "
        />


          <button
          type="submit"
            className="
                    absolute right-2 top-1/2 -translate-y-1/2
                    h-10 w-10
                    rounded-lg
                    bg-linear-to-br from-teal-500 bg-green-600
                    text-white
                    flex items-center justify-center
                    hover:shadow-lg
                    hover:scale-105
                    transition
                    focus:outline-none
                    focus:ring-2 focus:ring-teal-400/50
                  "
              aria-label="Search"
              onClick={handleSearchClick}
          >
            <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 3 10.5a7.5 7.5 0 0 0 13.65 6.15Z"
                    />
                  </svg>
          </button>
        </div>
      </div>
    </form>

      <div className="flex-1 overflow-y-auto px-5 py-5 scrollbar-hide" >
        <div className="space-y-4">

          <p className="font-semibold text-stone-800">
            Categories
          </p>

          <div className="grid grid-cols-2 gap-3">

            {categories.map((cat)=>{
              const active= selected.includes(cat.id)
              return(
                <button
                  key={cat.id}
                  onClick={()=>{toggleCategory(cat.id)}}
                  className={`
                      flex items-center gap-3 p-3 rounded-xl border
                      transition relative
                      ${active
                        ? "bg-[#229466] text-white border-[#11422C] shadow-lg"
                        : "bg-white border-stone-200 hover:shadow-md"}
                    `}
                >
                  <img
                    src={cat.icon}
                    className="w-9 h-9 rounded-lg object-cover"
                  />

                  <span className="text-sm font-medium">
                    {cat.name}
                  </span>

                </button>
                

            )})}
          </div>

          <button className="
            w-full py-3 rounded-xl
            bg-yellow-500 text-white font-semibold text-sm
            hover:bg-yellow-600 transition shadow-md"
            onClick={handleApplyClick}
            >
            Apply Filters
          </button>
        </div>
      </div>

      <div className="px-5 py-4 border-t border-stone-200">
        <button
          onClick={() => setDisplayFavBox(!displayFavBox)}
          className="
            w-full flex justify-between items-center
            px-5 py-4 rounded-2xl
            bg-linear-to-r from-green-900 to-green-700
            text-white shadow-lg hover:opacity-90 transition
          "
        >
          <div>
            <p className="font-semibold">Liked Places</p>
            <p className="text-xs opacity-80">Locations You Loved</p>
          </div>

          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
            {likedlength}
          </span>
        </button>
      </div>

    </aside>
    </>
  )
}
