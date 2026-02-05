"use client"

import { useEffect, useRef, useState } from "react"

const CATEGORIES = [
  { id: "nature", name: "Nature" },
  { id: "food", name: "Food" },
  { id: "culture", name: "Culture" },
  { id: "adventure", name: "Adventure" },
  { id: "restaurant", name: "Restaurant" },
  { id: "hostel", name: "Hostel" },
  { id: "dhaba", name: "Dhaba" },
  { id: "viewpoint", name: "ViewPoint" },
  { id: "library", name: "Library" },
  { id: "homestay", name: "Homestay" },
  { id: "hotel", name: "Hotel" },
  { id: "cafe", name: "Cafe" },
  { id: "others", name: "Others" }
]

export default function AddSpotModal({ onClose, onAddSpot, setShowAddModal, formData, setFormData, spotCoord, istickedRef, setPickingOnMap, pickingOnMap}) {
  //console.log("coord: ",spotCoord);
  
  useEffect(()=>{
    setPickingOnMap(istickedRef.current)
    if(!spotCoord) return
    setFormData(prev=>({
      ...prev,
      lat: spotCoord.lat,
      lng: spotCoord.lng
    }))
    istickedRef.current=true
    setPickingOnMap(istickedRef.current)
  },[spotCoord])

  const handleChange = (e) => {
    const { name, value } = e.target // eg: name: category, value: sports
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const onTick= ()=>{
    setPickingOnMap(!istickedRef.current)
    istickedRef.current=!istickedRef.current
    if(istickedRef.current==true){
      setShowAddModal(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    //console.log("reached handlesubmit");
    if (!formData.name || !formData.category) {
      alert("Please fill in name and category")
      return
    }
    if (!formData.lat || !formData.lng) {
      alert("Please set location on map or enter coordinates")
      return
    }
    onAddSpot({
      name: formData.name,
      description: formData.description,
      category: formData.category,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  <div className="bg-white rounded-2xl border border-emerald-100 shadow-2xl  max-w-md w-full transform transition-all">

    <div className="
      sticky top-0 z-10
      bg-linear-to-r from-emerald-500 to-teal-400
      px-6 py-4 flex justify-between items-center
      rounded-t-2xl
    ">
      <h2 className="text-xl font-semibold text-white tracking-wide">
        Add New Gem
      </h2>
      <button
        onClick={onClose}
        className="text-white/80 hover:text-white text-2xl transition"
      >
        ✕
      </button>
    </div>

    <form onSubmit={handleSubmit} className="p-6 space-y-5">

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gem Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="eg: Secret Waterfall"
          className="
            w-full px-4 py-2 rounded-xl border border-gray-200
            focus:outline-none focus:ring-2 focus:ring-emerald-400
            transition shadow-sm hover:shadow
          "
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          placeholder="Describe this place..."
          className="
            w-full px-4 py-2 rounded-xl border border-gray-200 resize-none
            focus:outline-none focus:ring-2 focus:ring-emerald-400
            transition shadow-sm hover:shadow
          "
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tag
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="
            w-full px-4 py-2 rounded-xl border border-gray-200 bg-white
            focus:outline-none focus:ring-2 focus:ring-emerald-400
            transition shadow-sm hover:shadow
          "
          required
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Map toggle */}
      <div className="border-t pt-4">
        <label className="flex items-center gap-3 text-sm font-medium text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={pickingOnMap}
            onChange={onTick}
            className="w-4 h-4 accent-emerald-500"
          />
          Pick location on map
        </label>

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Latitude
            </label>
            <input
              type="number"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              step="0.0001"
              placeholder="eg: 40.7128"
              className="
                w-full px-4 py-2 rounded-xl border border-gray-200
                focus:outline-none focus:ring-2 focus:ring-emerald-400
                transition shadow-sm hover:shadow
              "
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Longitude
            </label>
            <input
              type="number"
              name="lng"
              value={formData.lng}
              onChange={handleChange}
              step="0.0001"
              placeholder="eg: -74.0060"
              className="
                w-full px-4 py-2 rounded-xl border border-gray-200
                focus:outline-none focus:ring-2 focus:ring-emerald-400
                transition shadow-sm hover:shadow
              "
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="
            flex-1 rounded-xl border border-gray-300 py-2
            hover:bg-gray-50 transition
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          className="
            flex-1 rounded-xl bg-linear-to-r from-emerald-500 to-teal-400
            text-white font-medium py-2
            shadow-lg hover:shadow-xl hover:scale-[1.02]
            transition
          "
        >
          Add Gem
        </button>
      </div>
    </form>
  </div>
</div>

  )
}
