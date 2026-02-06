"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import FollowerBox from "../../../components/follower-modal"
import FollowingBox from "../../../components/following-modal"
import api from "../../../../backend/src/api/apiClient"
export default function UserProfilePage(){
    const [user, setUser]= useState(null)
    const [followers, setFollowers] = useState(null)
    const [following, setFollowing] = useState(null)
    const [isFollowed, setIsFollowed]= useState(false)
    const [showFollowers, setShowFollowers]= useState(false)
    const [showFollowing, setShowFollowing]= useState(false)
    const [error, setError]= useState(null)
    const [showFollowButton, setShowFollowButton]= useState(true)
    const {userId}= useParams()

    useEffect(()=>{
        const fetchisFollowing= async()=>{
            try {
                const res= await api.get(
                    `/api/v1/follow/get/check/${userId}`
                )
                setShowFollowButton(res.data.data.isSame)
                //console.log(res.data.data.isSame);
                
                setIsFollowed(res.data.data.isFollowing)
                setError(null)
            } catch (error) {
                setError(error.response?.data?.message)
            }
        }
        fetchisFollowing()
    },[])

    useEffect(()=>{
        const fectchUserDetails= async()=>{
            try {
                const res= await api.get( 
                    `/api/v1/users/get/user/${userId}`
                )
                setUser(res.data.data.user)
                setFollowers(res.data.data.user.followers)
                setFollowing(res.data.data.user.followings)
                setError(null)
            } catch (error) {
                setError(error.response?.data?.message)
            }
        }
        fectchUserDetails()
    },[userId, isFollowed])

    const handleFollowerClick=()=>{
        setShowFollowing(false)
        setShowFollowers(!showFollowers)
    }

    const handleFollowingClick=()=>{
        setShowFollowers(false)
        setShowFollowing(!showFollowing)
    }

    const handleFollowClick=async()=>{
            try {
                await api.post(
                    `/api/v1/users/follow/user/${userId}`
                )
                setIsFollowed(!isFollowed)
                setError(null)
            } catch (error) {
                setError(error.response?.data?.message)
            }
    }

    if(!user){
        return (<div className="min-h-screen bg-sand flex items-center justify-center">Loading...</div>)
    }

    return(
    <div className="min-h-screen bg-linear-to-br from-sand via-cream to-stone">
        <nav className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-stone">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link
                href="/home"
                className="text-3xl font-bold text-[#0F766E] tracking-tight"
            >
                HiddenGems
            </Link>
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
                                {user.fullname}
                            </h1>

                            <p className="text-m text-stone-600 mt-1">
                                @{user.username}
                            </p>

                            <div className="mt-4 max-w-xl mx-auto md:mx-0 text-dark-text/70 text-lg">
                                {user.bio || "Exploring and saving hidden gems 🌍"}
                            </div>

                            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-8">
                                <div className="group text-center">
                                    <p className="text-2xl font-bold text-dark-text group-hover:text-green-600 transition">
                                        {user.reviewHistory.length}
                                    </p>
                                    <p className="text-sm uppercase tracking-wide text-dark-text/50 group-hover:text-green-600 transition">
                                        Reviews
                                    </p>
                                </div>

                                <div className="group text-center">
                                    <p className="text-2xl font-bold text-dark-text group-hover:text-green-600 transition">
                                        {user?.savedSpots?.length ?? 0}
                                    </p>
                                    <p className="text-sm uppercase tracking-wide text-dark-text/50 group-hover:text-green-600 transition">
                                        Saved Gems
                                    </p>
                                </div>

                                <button className="group text-center cursor-pointer"
                                    onClick={()=>{handleFollowerClick()}}
                                    >
                                    <p className="text-2xl font-bold text-dark-text group-hover:text-green-600 transition">
                                        {followers?.length ?? 0}
                                    </p>
                                    <p className="text-sm uppercase tracking-wide text-dark-text/50 group-hover:text-green-600 transition">
                                        Followers
                                    </p>
                                </button>

                                <button className="group text-center cursor-pointer"
                                    onClick={()=>{handleFollowingClick()}}
                                >
                                    <p className="text-2xl font-bold text-dark-text group-hover:text-green-600 transition">
                                        {following?.length ?? 0}
                                    </p>
                                    <p className="text-sm uppercase tracking-wide text-dark-text/50 group-hover:text-green-600 transition">
                                        Following
                                    </p>
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-4 md:mt-0">
                            {showFollowButton? (<button
                                className={`px-6 py-2 rounded-full 
                                    ${ isFollowed ? "border border-green-700 text-black bg-white":
                                    "bg-green-600 text-white font-medium hover:bg-green-700 transition shadow"}`}
                                onClick={()=>{handleFollowClick()}}
                            >
                                {isFollowed? "Unfollow" : "Follow"}
                            </button>) : ("")
                            }
                        </div>
                        
                    </div>
                </div>
            </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-20 space-y-20">
            <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Saved Gems</h2>
            <span className="text-sm text-stone-500">
                {user.savedSpots.length} locations
            </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.savedSpots.map((spot) => (
                <div
                key={spot._id}
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
                <h2 className="text-3xl font-bold">{`${user.username}`}'s Reviews</h2>
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
                <h3 className="text-sm font-semibold text-stone-900 mb-1">
                    {review.spotName.charAt(0).toUpperCase() + review.spotName.slice(1)}
                </h3>

                <p className="text-sm text-stone-700 leading-relaxed line-clamp-4">
                    {review.content}
                </p>

                <div className="mt-4 flex justify-between items-center text-xs text-stone-400">
                    <span className="uppercase tracking-wide">{review.tag}</span>
                </div>
                </div>
            ))}
            </div>
        </section>
        {showFollowers&&
        <FollowerBox
            onClose={()=>{setShowFollowers(false)}}
            followers={followers}
        />
        }
        {showFollowing&&
        <FollowingBox
            onClose={()=>{setShowFollowing(false)}}
            followings={following}
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