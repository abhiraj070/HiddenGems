"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [loading, setLoading] = useState(true)
  const [followers, setFollowers] = useState(0) 


  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth?mode=login")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setEditedName(parsedUser.fullname)
    setLoading(false)
  }, [router])

  const handleSaveProfile = () => {
    if (user && editedName.trim()) {
      const updatedUser = { ...user, fullname: editedName }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setIsEditing(false)
    }
  }

  // const handleRemoveFavorite = (spotId) => {
  //   const updatedFavorites = favorites.filter((fav) => fav.id !== spotId)
  //   setFavorites(updatedFavorites)
  //   if (user) {
  //     const updatedUser = {
  //       ...user,
  //       favorites: updatedFavorites.map((f) => f.id),
  //     }
  //     setUser(updatedUser)
  //     localStorage.setItem("user", JSON.stringify(updatedUser))
  //   }
  //}

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
  <nav className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-stone">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <Link
        href="/home"
        className="text-3xl font-bold text-gradient tracking-tight"
      >
        HiddenGems
      </Link>

      <button
        onClick={handleLogout}
        className="px-5 py-2 rounded-full border border-stone text-m font-medium hover:bg-stone-100 transition"
      >
        Logout
      </button>
    </div>
  </nav>

  <section className="max-w-7xl mx-auto px-6 pt-12 pb-10">
    <div className="relative bg-white rounded-3xl border border-stone shadow-xl p-8 md:p-10">
      <div className="flex flex-col md:flex-row md:items-center gap-8">
        <div className="shrink-0">
          <div className="h-28 w-28 rounded-full overflow-hidden bg-linear-to-br from-teal to-green-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {user.profilepicture? 
            (<img
              src={user.profilepicture}
              className="h-full w-full object-cover"
              loading="lazy"
            />): 
              (user.fullname?.[0]?.toUpperCase())}
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-dark-text mb-1">
            {isEditing ? (
              <input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full border-b-2 border-teal focus:outline-none text-3xl font-bold"
              />
            ) : (
              user.fullname
            )}
          </h1>

          <p className="text-xl text-dark-text/40 mt-1">
             {user.username}
          </p>

          <div className="flex gap-8 mt-2">
            <div>
              <p className="text-xl font-bold">{user.reviewHistory.length}</p>
              <p className="text-sm text-dark-text/50 uppercase">Reviews</p>
            </div>

            <div>
              <p className="text-xl font-bold">0</p>
              <p className="text-sm text-dark-text/50 uppercase">Saved Gems</p>
            </div>

            <button
              onClick={() => {
                console.log("Followers clicked")
              }}
              className="text-left group"
            >
              <p className="text-xl font-bold group-hover:text-green-600 transition">
                {followers}
              </p>
              <p className="text-sm text-dark-text/50 uppercase group-hover:text-green-600 transition">
                Followers
              </p>
            </button>
          </div>

        </div>

        <div className="flex gap-3">
          <button
            className="px-6 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition shadow"
          >
            Follow
          </button>


          <button
            onClick={() =>
              isEditing ? handleSaveProfile() : setIsEditing(true)
            }
            className="px-6 py-2 rounded-full border border-stone font-medium hover:bg-stone-100 transition"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
      </div>

      {isEditing && (
        <button
          onClick={() => {
            setIsEditing(false)
            setEditedName(user.fullname)
          }}
          className="mt-4 text-m text-red-500 hover:underline"
        >
          Cancel Editing
        </button>
      )}
    </div>
  </section>

  <section className="max-w-7xl mx-auto px-6 pb-20 space-y-20">
    <div>
      <h2 className="text-3xl font-bold mb-6">Saved Gems</h2>
      {/* {favorites.length === 0 ? ( */}
        <div className="bg-white border border-stone rounded-2xl p-12 text-center">
          <p className="text-dark-text/60 text-lg mb-4">
            No saved gems yet
          </p>
          <Link
            href="/home"
            className="inline-block px-6 py-3 rounded-full bg-teal text-white font-medium hover:bg-teal/90 transition"
          >
            Explore Gems
          </Link>
        </div>
      {/* ) : ( */}
        {/* <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((spot) => (
            <div
              key={spot.id}
              className="bg-white border border-stone rounded-2xl overflow-hidden hover:shadow-xl transition"
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={spot.image || "/placeholder.svg"}
                  alt={spot.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform"
                />
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">
                    {spot.name}
                  </h3>
                  <button
                    onClick={() => handleRemoveFavorite(spot.id)}
                    className="text-red-500 hover:scale-110 transition"
                  >
                    ♥
                  </button>
                </div>

                <p className="text-sm text-dark-text/60 mb-2 line-clamp-2">
                  {spot.description}
                </p>

                <span className="text-xs text-dark-text/40 capitalize">
                  {spot.category}
                </span>
              </div>
            </div>
          ))}
        </div> */}
      {/* )} */}
    </div>

      <div>
      <h2 className="text-3xl font-bold mb-6">Review History</h2>
      {user.reviewHistory.length === 0 ? (
        <div className="bg-white border border-stone rounded-2xl p-12 text-center">
          <p className="text-dark-text/60 text-lg">No reviews yet</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {user.reviewHistory.map((review, idx) => (
            <div
              key={idx}
              className="
                bg-white
                border border-stone-200
                rounded-2xl
                p-5
                flex flex-col
                justify-between
                transition
                hover:shadow-lg
              "
            >
              <div className="mb-3">
                <h3 className="text-base font-semibold text-stone-900 leading-snug">
                  {review.spotName}
                </h3>
              </div>

              <p className="text-m text-stone-700 leading-relaxed flex-1">
                {review.content}
              </p>

              <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-center">
                <span className="text-xs text-stone-400 uppercase tracking-wide">
                  {review.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
</div>
  )
}
