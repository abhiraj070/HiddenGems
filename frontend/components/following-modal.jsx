"use client"

export default function FollowingBox({onClose, following}){
    console.log("following: ",following);
    
    return(
        <div className=" fixed
            left-[800px]
            top-[162.5px]
            z-1000
            w-[400px]
            max-h-[60vh]
            rounded-2xl
            bg-white/90 backdrop-blur
            border border-green-200
            shadow-xl
            p-4
            flex flex-col
        ">
        <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-stone-900">
                Following
            </h2>
            <button className="w-13 h-12 flex items-center justify-center rounded-full
                            text-gray-500 hover:text-gray-800 hover:bg-gray-200
                            transition cursor-pointer"
                onClick={onClose}
            >
                ✕
            </button>
        </div>
        <div className="flex flex-col gap-6">
            {following.map((user) => (
                <div
                key={user._id}
                className="
                    flex items-center gap-4
                    group
                    w-full max-w-[360px]
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
                    {user.profilepicture ? (
                    <img
                        src={user.profilepicture}
                        alt="profile"
                        className="h-full w-full object-cover"
                    />
                    ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-600">
                        {user.username?.[0]?.toUpperCase()}
                    </span>
                    )}
                </div>

                <div className="leading-tight">
                    <p className="font-semibold text-stone-800 group-hover:text-green-700">
                    {user.username}
                    </p>
                    <p className="text-sm text-stone-500">
                    {user.fullname}
                    </p>
                </div>
                </div>
            ))}
            </div>

    </div>
    )
}