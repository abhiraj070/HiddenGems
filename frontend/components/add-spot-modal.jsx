"use client"

import { useState } from "react"

const CATEGORIES = [
  { id: "nature", name: "Nature" },
  { id: "food", name: "Food" },
  { id: "culture", name: "Culture" },
  { id: "adventure", name: "Adventure" },
]

export default function AddSpotModal({ onClose, onAddSpot }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "nature",
    photoUrl: "",
    lat: "",
    lng: "",
  })
  const [pickingOnMap, setPickingOnMap] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

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
      lat: Number.parseFloat(formData.lat),
      lng: Number.parseFloat(formData.lng),
      image: formData.photoUrl || "/new-gem.jpg",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-stone shadow-xl max-w-md w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-sand border-b border-stone px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-dark-text">Add New Gem</h2>
          <button
            onClick={onClose}
            className="text-dark-text/60 hover:text-dark-text text-2xl leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">Gem Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-teal bg-cream cursor-text"
              placeholder="e.g., Secret Waterfall"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-teal bg-cream resize-none cursor-text"
              rows="3"
              placeholder="Describe this amazing place..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-teal bg-cream cursor-pointer"
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">Photo URL (optional)</label>
            <input
              type="url"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-teal bg-cream cursor-text"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="border-t border-stone pt-4">
            <label className="flex items-center gap-2 text-sm font-medium text-dark-text mb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={pickingOnMap}
                onChange={(e) => setPickingOnMap(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              Pick location on map
            </label>

            {!pickingOnMap ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">Latitude</label>
                  <input
                    type="number"
                    name="lat"
                    value={formData.lat}
                    onChange={handleChange}
                    step="0.0001"
                    className="w-full px-4 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-teal bg-cream cursor-text"
                    placeholder="40.7128"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">Longitude</label>
                  <input
                    type="number"
                    name="lng"
                    value={formData.lng}
                    onChange={handleChange}
                    step="0.0001"
                    className="w-full px-4 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-teal bg-cream cursor-text"
                    placeholder="-74.0060"
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-teal bg-teal/10 p-3 rounded-lg">
                Click on the map to select a location, then close this modal to confirm.
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 btn-outline cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary cursor-pointer">
              Add Gem
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
