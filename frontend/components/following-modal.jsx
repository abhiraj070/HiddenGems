"use client"
import Link from "next/link"
export default function FollowingBox({onClose, followings}){
    //console.log("following: ",followings);
    return(
        <div className="
        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
        w-96 max-h-[60vh]
        rounded-2xl bg-white/90 backdrop-blur
        border border-green-200 shadow-xl p-4
        flex flex-col
        ">

        <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-stone-900">
                Followings
            </h2>
            <button className="w-13 h-12 flex items-center justify-center rounded-full
                            text-gray-500 hover:text-gray-800 hover:bg-gray-200
                            transition cursor-pointer"
                onClick={onClose}
            >
                ✕
            </button>
        </div>
        <div className="flex flex-col gap-4 overflow-y-auto">
            {followings.map((user) => (
            <Link
                href={`/profile/${user.following._id}`}
                key={user._id}
                className="block"
            >
            <div className="
                flex items-center gap-4
                w-full
                rounded-2xl
                border border-stone-200
                bg-white/70 backdrop-blur
                p-5
                shadow-sm
                hover:shadow-xl hover:-translate-y-1
                transition-all duration-300
            ">


                <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                    {user.following.profilepicture ? (
                    <img
                        src={user.following.profilepicture}
                        alt="profile"
                        className="h-full w-full object-cover"
                    />
                    ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-600">
                        {user.following.username?.[0]?.toUpperCase()}
                    </span>
                    )}
                </div>

                <div className="leading-tight min-w-0">
                <p className="font-semibold text-stone-800 group-hover:text-green-700 truncate">
                    {user.following.username}
                </p>

                <p className="text-sm text-stone-500 truncate">
                    {user.following.fullname}
                </p>

                </div>

                </div>
            </Link>
            ))}
            </div>
    </div>
    )
}