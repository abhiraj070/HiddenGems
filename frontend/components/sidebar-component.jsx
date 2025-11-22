"use client"

import { useState } from "react"

export default function SidebarComponent({
  selectedCategories = [],
  onCategoryChange,
  favorites,
  onShowFavorites,
  wishlist = [],
}) {
  const categories = [
    { id: "cafe", name: "Cafe", icon: "☕" },
    { id: "hotel", name: "Hotel", icon: "🏨" },
    { id: "restaurant", name: "Restaurant", icon: "🍽️" },
    { id: "homestay", name: "Homestay", icon: "🏡" },
    { id: "hostel", name: "Hostel", icon: "🛏️" },
    { id: "library", name: "Library", icon: "📚" },
    { id: "viewpoint", name: "Viewpoint", icon: "🏞️" },
    { id: "dhaba", name: "Dhaba", icon: "🍜" },
  ]

  const [expandedCategories, setExpandedCategories] = useState(false)

  const handleCategoryToggle = (categoryId) => {
    const updated = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((c) => c !== categoryId)
      : [...selectedCategories, categoryId]

    onCategoryChange(updated.length === 0 ? [] : updated)
  }

  const isSelected = (categoryId) => {
    return selectedCategories.includes(categoryId)
  }

  return (
    <div
      className="fixed left-0 top-20 bottom-0 w-80 bg-cream border-r border-stone flex flex-col z-10 overflow-hidden"
      style={{ height: "calc(100vh - 80px)" }}
    >
      <div className="p-6 border-b border-stone">
        <button
          onClick={() => setExpandedCategories(!expandedCategories)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-teal text-sand font-semibold hover:bg-teal/90 transition-colors cursor-pointer"
        >
          <span>🔍 Filter Locations</span>
          <span>{expandedCategories ? "▼" : "▶"}</span>
        </button>

        {expandedCategories && (
          <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-stone/30 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isSelected(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-xl">{category.icon}</span>
                <span className="text-dark-text font-medium">{category.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-end">
        <div className="space-y-3">
          <button
            onClick={() => onShowFavorites("favorites")}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-coral/10 text-coral hover:bg-coral/20 transition-colors cursor-pointer font-medium"
          >
            <span>❤️ Saved</span>
            <span className="bg-coral text-white text-xs font-bold px-2 py-1 rounded-full">{favorites.length}</span>
          </button>

          <button
            onClick={() => onShowFavorites("wishlist")}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-teal/10 text-teal hover:bg-teal/20 transition-colors cursor-pointer font-medium"
          >
            <span>📌 Wishlist</span>
            <span className="bg-teal text-white text-xs font-bold px-2 py-1 rounded-full">{wishlist.length}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
