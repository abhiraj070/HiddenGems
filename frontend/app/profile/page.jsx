"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [reviewHistory, setReviewHistory] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth?mode=login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setEditedName(parsedUser.name)

    // Load favorites with full details
    const allSpots = JSON.parse(localStorage.getItem("spots") || "[]")
    const favSpots = allSpots.filter((spot) => parsedUser.favorites?.includes(spot.id))
    setFavorites(favSpots)

    const reviews = JSON.parse(localStorage.getItem("reviewHistory") || "[]")
    setReviewHistory(reviews)

    setLoading(false)
  }, [router])

  const handleSaveProfile = () => {
    if (user && editedName.trim()) {
      const updatedUser = { ...user, name: editedName }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setIsEditing(false)
    }
  }

  const handleRemoveFavorite = (spotId) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== spotId)
    setFavorites(updatedFavorites)

    if (user) {
      const updatedUser = {
        ...user,
        favorites: updatedFavorites.map((f) => f.id),
      }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (loading) {
    return <div className="min-h-screen bg-sand flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-sand via-cream to-stone">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-sand/80 backdrop-blur-sm border-b border-stone">
        <Link href="/home" className="text-3xl font-bold text-gradient hover:opacity-80 cursor-pointer">
          HiddenGems
        </Link>
        <button onClick={handleLogout} className="btn-outline cursor-pointer">
          Logout
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Profile Card */}
        <div className="bg-white rounded-lg border border-stone p-8 mb-12 shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-dark-text mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-teal cursor-pointer"
                  />
                ) : (
                  user.name
                )}
              </h1>
              <p className="text-lg text-dark-text/60">{user.email}</p>
              <p className="text-sm text-dark-text/50 mt-2">Member since {new Date().getFullYear()}</p>
            </div>

            <button
              onClick={() => {
                if (isEditing) {
                  handleSaveProfile()
                } else {
                  setIsEditing(true)
                }
              }}
              className="btn-primary cursor-pointer"
            >
              {isEditing ? "Save" : "Edit Profile"}
            </button>
          </div>

          {isEditing && (
            <button
              onClick={() => {
                setIsEditing(false)
                setEditedName(user.name)
              }}
              className="btn-outline text-sm cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Review History Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-dark-text mb-8">Review History ({reviewHistory.length})</h2>
          {reviewHistory.length === 0 ? (
            <div className="bg-white rounded-lg border border-stone p-12 text-center">
              <p className="text-dark-text/60 text-lg">No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviewHistory.map((review, idx) => (
                <div key={idx} className="bg-white rounded-lg border border-stone p-6 shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-dark-text">{review.spotName}</h3>
                    <span className="text-lg">{"⭐".repeat(review.rating)}</span>
                  </div>
                  <p className="text-dark-text/70 mb-2">{review.comment}</p>
                  <p className="text-xs text-dark-text/50">{new Date(review.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
          

        {/* Favorites Section */}
        <div>
          <h2 className="text-3xl font-bold text-dark-text mb-8">My Saved Gems ({favorites.length})</h2>

          {favorites.length === 0 ? (
            <div className="bg-white rounded-lg border border-stone p-12 text-center">
              <p className="text-dark-text/60 text-lg mb-4">No saved gems yet</p>
              <Link href="/home" className="btn-primary cursor-pointer">
                Explore and Save Gems
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {favorites.map((spot) => (
                <div
                  key={spot.id}
                  className="bg-white rounded-lg border border-stone overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 bg-muted overflow-hidden">
                    <img
                      src={spot.image || "/placeholder.svg"}
                      alt={spot.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-dark-text flex-1">{spot.name}</h3>
                      <button
                        onClick={() => handleRemoveFavorite(spot.id)}
                        className="text-coral hover:text-coral/80 transition-colors cursor-pointer"
                      >
                        ❤️
                      </button>
                    </div>
                    <p className="text-sm text-dark-text/60 mb-3">{spot.description}</p>
                    <p className="text-xs text-dark-text/50 capitalize">Category: {spot.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
