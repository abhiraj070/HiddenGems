"use client"

import axios from "axios"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function UserProfilePage(){
    const [user, setUser]= useState(null)
    const [followers, setFollowers] = useState(0)
    const {userId}= useParams()

    useEffect(()=>{
        const fectchUserDetails= async()=>{
            const res= await axios.get(
                `/api/v1/users/get/user/${userId}`
            )
            console.log("res: ",res);
            setUser(res.data.data)
        }
        fectchUserDetails()
    },[userId])

    if(!user){
        return (<div className="min-h-screen bg-sand flex items-center justify-center">Loading...</div>)
    }

    return(
    <div className="min-h-screen bg-linear-to-br from-sand via-cream to-stone">
        <nav className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-stone">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link
                href="/home"
                className="text-3xl font-bold text-gradient tracking-tight"
            >
                HiddenGems
            </Link>
            </div>
        </nav>

        <section className="max-w-7xl mx-auto px-6 pt-12 pb-10">
            <div className="relative bg-white rounded-3xl border border-stone shadow-xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-start gap-8">
                <div className="shrink-0">
                <div className="h-28 w-28 rounded-full overflow-hidden bg-linear-to-br from-teal to-green-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
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

                <div className="flex-1">
                <h1 className="text-3xl font-bold text-dark-text mb-1">
                    {user.fullname}
                </h1>

                <div className="text-base text-dark-text/70 mb-1">
                    {user.bio|| "No bio added yet"}
                </div>

                <p className="text-xl text-dark-text/40 mb-4">
                    @{user.username}
                </p>

                <div className="flex gap-10">
                    <div>
                    <p className="text-lg font-bold">{user.reviewHistory.length}</p>
                    <p className="text-sm text-dark-text/50 uppercase">Reviews</p>
                    </div>

                    <div>
                    <p className="text-lg font-bold">{user.savedPlaces.length}</p>
                    <p className="text-sm text-dark-text/50 uppercase">Saved Gems</p>
                    </div>

                    <button className="text-left group">
                    <p className="text-lg font-bold group-hover:text-green-600 transition">
                        {followers}
                    </p>
                    <p className="text-sm text-dark-text/50 uppercase group-hover:text-green-600 transition">
                        Followers
                    </p>
                    </button>
                </div>
                </div>

                <div className="flex gap-3 mt-4 md:mt-0">
                <button
                    className="px-6 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition shadow"
                >
                    Follow
                </button>
                </div>
            </div>
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
        </div>
    )

}