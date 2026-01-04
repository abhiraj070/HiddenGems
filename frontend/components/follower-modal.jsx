"use client"

export default function FollowerBox({onClose, followers}){
    return(
    <div className=" fixed
            left-200 bottom-104.5
            z-1000
            w-[400px]
            max-h-[60vh]
            rounded-2xl
            bg-white/90 backdrop-blur
            border border-green-200
            shadow-xl
            p-4
            flex flex-col">
        <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-stone-900">
                Followers
            </h2>
            <button className="w-13 h-12 flex items-center justify-center rounded-full
                            text-gray-500 hover:text-gray-800 hover:bg-gray-200
                            transition cursor-pointer"
                onClick={onClose}
            >
                ✕
            </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                {
                    followers.map((follower)=>{
                        <div
                        key={follower._id}
                        className="
                        group
                        rounded-2xl
                        border border-stone-200
                        bg-white/70 backdrop-blur
                        p-5
                        shadow-sm
                        hover:shadow-xl
                        hover:-translate-y-1
                        transition-all duration-300
                        cursor-pointer
                        "
                    >
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                        <img
                            src={follower.profilepicture}
                            alt="profile"
                            className="h-full w-full object-cover"
                        />
                        </div>
                        <h3 className="text-lg font-semibold text-stone-800 group-hover:text-green-700 transition">
                            {follower.username}
                        </h3>
                        <h3 className="text-lg font-semibold text-stone-800 group-hover:text-green-700 transition">
                            {follower.fullname}
                        </h3>
                    </div>
                    })
                }
            </div>
        </div>
    </div>
        )
}