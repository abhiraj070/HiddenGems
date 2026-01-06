"use client"

export default function LikeBoxComponent({allLikedSpots, onClose}){
    if(!allLikedSpots){
        return null
    }
    return(
    <div className=" fixed
            left-92 bottom-6
            z-1000
            w-420px
            max-h-[60vh]
            rounded-2xl
            bg-white/90 backdrop-blur
            border border-green-200
            shadow-xl
            p-4
            flex flex-col">
        <div className="mb-8 flex items-center justify-between">
            <div>
            <h2 className="text-2xl font-bold text-stone-900">
                Liked Places
            </h2>
            <p className="text-sm text-stone-500 mt-1">
                Places you liked
            </p>
            </div>

            <span className="
            px-4 py-1.5
            rounded-full
            text-sm font-semibold
            bg-green-100 text-green-700
            ">
            {allLikedSpots.length} Liked
            </span>
            <button
                onClick={onClose}
                className="w-13 h-12 flex items-center justify-center rounded-full
                            text-gray-500 hover:text-gray-800 hover:bg-gray-200
                            transition cursor-pointer"
                >
                ✕
                </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                {allLikedSpots.map((place) => (
                <div
                    key={place._id}
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
                    <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-stone-800 group-hover:text-green-700 transition">
                        {place.spotName}
                    </h3>

                    <button
                        className="
                        text-green-500
                        transition
                        text-xl
                        "
                        title="Remove from liked"
                    >
                        ♥
                    </button>
                    </div>

                    <div className="flex items-center justify-between">
                    <span className="
                        text-xs font-medium
                        px-3 py-1
                        rounded-full
                        bg-green-50 text-green-700
                    ">
                        {place.category || "Hidden Gem"}
                    </span>
                    </div>
                </div>
                ))}
            </div>

            {allLikedSpots.length === 0 && (
                <div className="mt-16 text-center">
                <div className="
                    inline-flex items-center justify-center
                    h-16 w-16 rounded-full
                    bg-green-100 text-green-700
                    text-2xl mb-4
                ">
                    ♥
                </div>
                <p className="text-stone-600">
                    You haven’t liked any places yet.
                </p>
                </div>
            )}
            </div>
        </div>
        )

}