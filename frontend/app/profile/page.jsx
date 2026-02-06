"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import api from "../api/apiClient"
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
  const [isReviewEditing, setIsReviewEditing]= useState(false)
  const [editedReview, setEditedReview]= useState("")


  console.log("user:",user);
  
  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth?mode=login")
      return
    }
    const fetchUser= async ()=>{
      try {
        const res= await api.get(
          `/api/v1/users/get/user`
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
      const res=await api.post(
        `/api/v1/users/addbio`,
        {bio: bio},
      )
      setUser(res.data.data)
      setEditedBio(bio)
      setError(null)
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
          const res= await api.get(
            `/api/v1/users/get/user`
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

  const handleClickEditReview=(i)=>{
    setIsReviewEditing(!isReviewEditing)
    setEditedReview(user.reviewHistory[i].content || "")
  }

  const handleSaveReview= async(id)=>{
      setIsReviewEditing(false)
    try {
      await api.post(
        `/api/v1/review/edit/review/${id}`,
        {review: editedReview}
      )
      setError(null)
    } catch (error) {
      setError(error.response?.data?.message)
    }
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
        await api.post(
          `/api/v1/users/edit/name`,
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
      await api.post(
        `/api/v1/users/logout`
      )
      setError(null)
    } catch (error) {
      setError(error.response?.data?.message)
    } finally{
      localStorage.removeItem("user")
      router.push("/")
    }
  }

  const handleCommentDelete= async(id)=>{
    await api.post(
      `/api/v1/review/delete/comment/${id}`
    )
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
        className="text-3xl font-bold text-[#0F766E] tracking-tight"
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
                  {user.savedSpots.length ?? 0}
                </p>
                <p className="text-sm uppercase tracking-wide text-dark-text/50 group-hover:text-green-600 transition">
                  Saved Gems
                </p>
              </div>

              <button className="group text-center cursor-pointer"
              onClick={()=>{handleFollowerClick()}}
              >
                <p className="text-2xl font-bold text-dark-text group-hover:text-green-600 transition">
                  {user.followers?.length ?? 0}
                </p>
                <p className="text-sm uppercase tracking-wide text-dark-text/50 group-hover:text-green-600 transition">
                  Followers
                </p>
              </button>
              <button className="group text-center cursor-pointer"
              onClick={()=>{handleFollowingClick()}}
              >
                <p className="text-2xl font-bold text-dark-text group-hover:text-green-600 transition">
                  {user.followings?.length ?? 0}
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

  <section className="max-w-7xl mx-auto px-6 py-24 space-y-28">


<div className="space-y-10">
  <div className="flex justify-between items-end">
    <div>
      <h2 className="text-4xl font-extrabold tracking-tight">
        Saved Gems
      </h2>
      <p className="text-stone-500 mt-1">
        Places you loved & saved
      </p>
    </div>

   <div className="flex items-center gap-3 mt-1">
  <p className="text-stone-500 text-sm">
    Spots
  </p>

  <span className="px-3 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-semibold">
    {user.savedSpots.length}
  </span>
</div>
  </div>

  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

    {user.savedSpots.map(spot => (
      <div
        key={spot._id}
        onClick={() => handleSpotClick(spot)}
        className="
          group relative overflow-hidden
          rounded-3xl p-7
          bg-linear-to-br from-white to-stone-100
          border border-stone-200
          shadow-sm hover:shadow-2xl
          transition-all duration-300
          hover:-translate-y-2
          cursor-pointer
        "
      >

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-linear-to-br from-green-50 to-transparent" />

        <button
          onClick={(e) => {
            e.stopPropagation()
            handleSavedDelete(spot._id)
          }}
          className="
            absolute top-4 right-4 z-10
            p-2 rounded-full
            bg-white shadow-md
            opacity-0 group-hover:opacity-100
            hover:text-red-500
            transition
          "
        >
          🗑
        </button>

        <h3 className="relative text-2xl font-semibold text-stone-900 mb-3">
          {spot.spotName[0].toUpperCase() + spot.spotName.slice(1)}
        </h3>

        <p className="relative text-sm text-green-600 font-medium">
          Explore on map →
        </p>

      </div>
    ))}
  </div>
</div>

<div className="space-y-10">

  <div className="flex justify-between items-end">
    <div>
      <h2 className="text-4xl font-extrabold tracking-tight">
        Your Comments
      </h2>
      <p className="text-stone-500 mt-1">
        Quick thoughts you shared
      </p>
    </div>

    <div className="flex items-center gap-3 mt-1">
  <p className="text-stone-500 text-sm">
    Comments
  </p>

  <span className="px-3 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-semibold">
    {user.comments.length}
  </span>
</div>

  </div>

  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">

    {user.comments.map(comment => (
      <div
        key={comment._id}
        className="
          group relative rounded-3xl
          bg-white border border-stone-200
          p-6 shadow-sm hover:shadow-xl
          transition
        "
      >

        <button
          onClick={() => handleCommentDelete(comment._id)}
          className="
            absolute top-4 right-4
            opacity-0 group-hover:opacity-100
            transition
            hover:text-red-500
          "
        >
          🗑
        </button>

        <p className="text-stone-700 leading-relaxed line-clamp-5">
          {comment.content}
        </p>

        <div className="mt-5 flex items-center justify-between text-xs">
          <span className=" py-1 rounded-full text-stone-400 italic">
            spotName: {comment.review.spotName}
          </span>
          <span className="text-stone-400 italic">
            Tag: {comment.review.tag}
          </span>
        </div>

      </div>
    ))}
  </div>
</div>

<div className="space-y-10">

  <div className="flex justify-between items-end">
    <div>
      <h2 className="text-4xl font-extrabold tracking-tight">
        Your Liked Reviews
      </h2>
      <p className="text-stone-500 mt-1">
        Reviews you loved
      </p>
    </div>

    <div className="flex items-center gap-3 mt-1">
      <p className="text-stone-500 text-sm">
        Liked
      </p>

      <span className="px-3 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-semibold">
        {user.likedReviews.length}
      </span>
    </div>

      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">

        {user.likedReviews.map((liked) => (
              <div
                key={liked._id}
                className=" group relative rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-green-600 hover:bg-green-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">

                  <div className="flex items-center gap-3">
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
                      {liked.owner?.profilepicture ? (
                        <img
                          src={liked.owner.profilepicture}
                          alt={liked.owner.username}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 text-m font-medium">
                          {liked.owner?.username?.[0]?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {liked.owner?.username}
                    </div>
                  </div>

                  <div className="text-sm leading-relaxed text-gray-600 pl-13">
                    {liked.content}
                  </div>

                  </div>
                </div>
                <div className="mt-2 inline-flex items-center gap-3 text-xs">
                <span className="text-stone-400 italic">
                  spotName: {liked.spotName}
                </span>
                <span className="px-10 py-1 rounded-full text-stone-400 italic">
                  tag: {liked.tag}
                </span>
              </div>

              </div>
            ))}
      </div>
    </div>

<div className="space-y-10">

  <div className="flex justify-between items-end">
    <div>
      <h2 className="text-4xl font-extrabold tracking-tight">
        Review History
      </h2>
      <p className="text-stone-500 mt-1">
        Your detailed experiences
      </p>
    </div>

    <div className="flex items-center gap-3 mt-1">
  <p className="text-stone-500 text-sm">
    Reviews
  </p>

  <span className="px-3 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-semibold">
    {user.reviewHistory.length}
  </span>
</div>

  </div>

  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">

    {user.reviewHistory.map((review, i) => (
      <div
        key={review._id}
        className="
          group relative rounded-3xl
          bg-linear-to-br from-white to-stone-50
          border border-stone-200
          p-7 shadow-sm hover:shadow-xl
          transition
        "
      >

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-green-50/40 transition" />

        <button
          onClick={() => handleReviewDelete(review._id)}
          className="
            absolute top-4 right-4 z-10
            opacity-0 group-hover:opacity-100
            hover:text-red-500 transition
          "
        >
          🗑
        </button>

        <button
          onClick={() =>
            isReviewEditing
              ? handleSaveReview(review._id)
              : handleClickEditReview(i)
          }
          className="
            absolute top-4 right-14 z-10
            opacity-0 group-hover:opacity-100
            hover:text-green-600 transition
          "
        >
          {isReviewEditing ? "💾" : "✎"}
        </button>

        <h3 className="relative text-lg font-semibold mb-2">
          {review.spotName[0].toUpperCase() + review.spotName.slice(1)}
        </h3>

        {isReviewEditing ? (
          <input
            value={editedReview}
            onChange={e => setEditedReview(e.target.value)}
            className="
              relative w-full
              bg-transparent
              border-b-2 border-green-500
              focus:outline-none py-1
            "
          />
        ) : (
          <p className="relative text-stone-700 leading-relaxed line-clamp-5">
            {review.content}
          </p>
        )}

        <div className="mt-5 flex justify-between items-center text-xs">
          <span className=" py-1 rounded-full text-stone-400 italic">
            Tag:{review.tag}
          </span>
          <span className="text-stone-400 italic">
            your review
          </span>
        </div>

      </div>
    ))}
  </div>
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
      followings={user.followings}
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
