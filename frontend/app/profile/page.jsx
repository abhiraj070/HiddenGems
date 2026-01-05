"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import DeleteComponent from "../../components/delete-component"
import FollowerBox from "../../components/follower-modal"
import FollowingBox from "../../components/following-modal"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [loading, setLoading] = useState(true)
  const [showPopUp, setShowPopUp]= useState(false)
  const [confirmDelete, setConfirmDelete]= useState(false)
  const [deleteReviewId, setDeleteReviewId]= useState(null)
  const [deleteSavedId, setDeleteSavedId]= useState(null)
  const [editedBio, setEditedBio]= useState("")
  const [showFollowers, setShowFollowers]= useState(false)
  const [showFollowing, setShowFollowing]= useState(false)
  const [error, setError]= useState()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth?mode=login")
      return
    }
    const fetchUser= async ()=>{
      try {
        const res= await axios.get(
          "/api/v1/users/get/user"
        )
        setUser(res.data.data.user)
        setError(null)
        //console.log("user: ",res.data.data);
      } catch (error) {
        setError(error.response?.data?.message)
      }finally{  
        setLoading(false) //loading is implemented to cover the time taken by the async function. after that no matter the result the loading should be removed
      }
    }
    fetchUser()
  }, [])

  const handleEditBio=async(bio)=>{
    try {
      const res=await axios.post(
        "/api/v1/users/addbio",
        {bio: bio},
      )
      setUser(res.data.data)
      setEditedBio(bio)
      setError(null)
      setIsEditing(false)
    } catch (error) {
      setError(error.response?.data?.message)
    }
  }

  const handleReviewDelete=(id)=>{
    setShowPopUp(true)
    setDeleteReviewId(id)
  }
  const handleSavedDelete=(id)=>{
    setShowPopUp(true)
    setDeleteSavedId(id)
  }


  useEffect(()=>{
    if(confirmDelete){
      const fetchUser= async ()=>{
        try {
          setLoading(true)
          const res= await axios.get(
            "/api/v1/users/get/user"
          )
          setUser(res.data.data.user)
          setError(null)
          setConfirmDelete(false)
          setDeleteReviewId(null)
          setDeleteSavedId(null)
        } catch (error) {
          setError(error.response?.data?.message)
        }finally{
          setLoading(false)
        }
      }
      fetchUser()
    }
  },[confirmDelete])

  const handleSpotClick=()=>{
    router.push("/home")
  }

  const handleEditClick=()=>{
    setEditedBio(user.bio||"")
    setEditedName(user.fullname||"")
    setIsEditing(true)
  }

  const handleFollowerClick= ()=>{
    setShowFollowing(false)
    setShowFollowers(!showFollowers)
  }

  const handleFollowingClick=()=>{
    setShowFollowers(false)    
    setShowFollowing(!showFollowing)
  }

  const handleSaveProfile = async() => {
    if (editedName.trim()) {
      try {
        await axios.post(
          "/api/v1/users/edit/name",
          {name: editedName}
        )
        const updatedUser = { ...user, fullname: editedName }
        setUser(updatedUser)
      } catch (error) {
        setError(error.response?.data?.message)
      }
      setIsEditing(false)
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post(
        "/api/v1/users/logout"
      )
      setError(null)
    } catch (error) {
      setError(error.response?.data?.message)
    } finally{
      localStorage.removeItem("user")
      router.push("/")
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-sand flex items-center justify-center">Loading...</div>
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
        className="px-5 py-2 rounded-full border border-stone text-m font-medium transition hover:bg-green-4 00"
      >
        Logout
      </button>
    </div>
  </nav>

  <section className="max-w-7xl mx-auto px-6 pt-12 pb-10">
    <div className="relative bg-white rounded-3xl border border-stone shadow-xl p-8 md:p-10">
      <div className="relative w-full">
        <div
          className="
            flex flex-col md:flex-row items-center md:items-start
            gap-8
            p-8
            rounded-3xl
            bg-white/85 backdrop-blur
            border border-stone-200
            shadow-[0_25px_50px_-25px_rgba(0,0,0,0.35)]
          "
        >
          <div className="relative shrink-0">
            <div className="relative h-32 w-32 rounded-full overflow-hidden flex items-center justify-center text-white text-4xl font-bold ring-4 ring-white shadow-xl">
              {user.profilepicture ? (
                <img
                  src={user.profilepicture}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                user.fullname?.[0]?.toUpperCase()
              )}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-dark-text tracking-tight">
              {isEditing ? (
                <input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-green-500 focus:outline-none"
                />
              ) : (
                user.fullname
              )}
            </h1>

            <p className="text-m text-stone-600 mt-1">
              @{user.username}
            </p>

            <div className="mt-4 max-w-xl mx-auto md:mx-0 text-dark-text/70 text-lg">
              {isEditing ? (
                <input
                  value={editedBio}
                  onChange={(e) => handleEditBio(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-green-500 focus:outline-none"
                  placeholder="Write something about yourself"
                />
              ) : (
                editedBio || user.bio || "Exploring and saving hidden gems 🌍"
              )}
            </div>

            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-8">
              <div className="group text-center">
                <p className="text-2xl font-bold text-dark-text group-hover:text-green-600 transition">
                  {user.reviewHistory.length ?? 0}
                </p>
                <p className="text-sm uppercase tracking-wide text-dark-text/50 group-hover:text-green-600 transition">
                  Reviews
                </p>
              </div>

              <div className="group text-center">
                <p className="text-2xl font-bold text-dark-text group-hover:text-green-600 transition">
                  {user.savedPlaces.length ?? 0}
                </p>
                <p className="text-sm uppercase tracking-wide text-dark-text/50 group-hover:text-green-600 transition">
                  Saved Gems
                </p>
              </div>

              <button className="group text-center cursor-pointer"
              onClick={()=>{handleFollowerClick()}}
              >
                <p className="text-2xl font-bold text-dark-text group-hover:text-green-600 transition">
                  {user.followers.length ?? 0}
                </p>
                <p className="text-sm uppercase tracking-wide text-dark-text/50 group-hover:text-green-600 transition">
                  Followers
                </p>
              </button>
              <button className="group text-center cursor-pointer"
              onClick={()=>{handleFollowingClick()}}
              >
                <p className="text-2xl font-bold text-dark-text group-hover:text-green-600 transition">
                  {user.following.length ?? 0}
                </p>
                <p className="text-sm uppercase tracking-wide text-dark-text/50 group-hover:text-green-600 transition">
                  Following
                </p>
              </button>
            </div>
          </div>

          <div className="self-center md:self-start">
            <button
              onClick={() =>
                isEditing ? handleSaveProfile() : handleEditClick()
              }
              className="
                px-7 py-2.5
                rounded-full
                bg-linear-to-r from-green-500 to-teal-500
                text-white font-semibold
                shadow-lg
                hover:shadow-xl
                hover:scale-105
                active:scale-95
                transition
              "
            >
              {isEditing ? "Save Profile" : "Edit Profile"}
            </button>
          </div>
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
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-3xl font-bold">Saved Gems</h2>
      <span className="text-sm text-stone-500">
        {user.savedPlaces.length} locations
      </span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {user.savedPlaces.map((spot) => (
        <div
          key={spot._id}
          onClick={handleSpotClick}
          className="
            group relative
            cursor-pointer
            rounded-3xl
            border border-stone-200
            bg-linear-to-br from-white to-stone-50
            p-6
            transition-all duration-300
            hover:-translate-y-1
            hover:shadow-2xl
          "
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleSavedDelete(spot._id)
            }}
            className="
              absolute top-4 right-4
              opacity-0 group-hover:opacity-100
              scale-90 group-hover:scale-100
              transition
              bg-red-500 text-white
              rounded-full p-2
              shadow-lg
            "
          >
            🗑
          </button>

          <h3 className="text-xl font-semibold text-stone-900 mb-2">
            {spot.spotName.charAt(0).toUpperCase() + spot.spotName.slice(1)}
          </h3>

          <p className="text-sm  leading-relaxed text-green-600">
            Click to explore this gem on the map →
          </p>
        </div>
      ))}
    </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Review History</h2>
        <span className="text-sm text-stone-500">
          {user.reviewHistory.length} locations
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {user.reviewHistory.map((review) => (
        <div
          key={review._id}
          className="
            group
            relative
            rounded-2xl
            border border-stone-200
            bg-white
            p-5
            transition
            hover:shadow-lg
          "
        >
          <button
            onClick={() => handleReviewDelete(review._id)}
            className="
              absolute top-4 right-4
              opacity-0 group-hover:opacity-100
              transition
              text-stone-400 hover:text-red-500
            "
          >
            🗑
          </button>

          <h3 className="text-sm font-semibold text-stone-900 mb-1">
            {review.spotName.charAt(0).toUpperCase() + review.spotName.slice(1)}
          </h3>

          <p className="text-sm text-stone-700 leading-relaxed line-clamp-4">
            {review.content}
          </p>

          <div className="mt-4 flex justify-between items-center text-xs text-stone-400">
            <span className="uppercase tracking-wide">{review.tag}</span>
            <span className="italic">Your review</span>
          </div>
        </div>
      ))}
    </div>

  </section>
  {showPopUp&&
    <DeleteComponent
      setConfirmDelete={setConfirmDelete}
      setShowPopUp={setShowPopUp}
      deleteReviewId={deleteReviewId}
      deleteSavedId={deleteSavedId}
    />
  }

  {showFollowers && 
    <FollowerBox
      onClose={()=>{setShowFollowers(false)}}
      followers={user.followers}
    />
  }
  {showFollowing &&
    <FollowingBox
      onClose={()=>{setShowFollowing(false)}}
      following={user.following}
    />
  }

  {error && (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded">
      {error}
    </div>
  )}
</div>
  )
}
