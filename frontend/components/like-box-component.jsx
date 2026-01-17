"use client"
import { useRef, useEffect, useState, useCallback } from "react";
import axios from "axios";
export default function LikeBoxComponent({ onClose, cursor, setCursor, likedlength}){
    const observerRef = useRef(null);
    const fetchRef = useRef(null);
    const [allLikedSpots, setAllLikedSpots]= useState([])
    const [hasMore, setHasMore]= useState(true)
    const [error, setError]= useState(null)
    const [loading, setLoading]= useState(false)

    const fetchLikedSpots= useCallback(async ()=>{ //we didn't used useEffect here cuz useEffect will run this function when consditions achieved. but usecallback will only return a stable function refrence which only recreates when the dependencies changes.
        if(!loading && hasMore){//if we dont want our function refrence to change on every rerender(because this function is present in ome useeffects dependency array and if the refrence changes it triggers the effect), we use useCallback
            setLoading(true)
            try {
                const url = cursor 
                    ? `/api/v1/like/getlikedSpots?cursor=${cursor}&limit=5`
                    : `/api/v1/like/getlikedSpots?limit=5`;
                const res= await axios.get(url)
                //console.log(res.data.data)
                setError(null)
                setCursor(res.data.data.nextCursor)
                setHasMore(Boolean(res.data.data.nextCursor))
                //console.log("res: ",res);
                setAllLikedSpots(prev=>[...prev,...res.data.data.data])
            } catch (error) {
                setError(error.message)
            } finally{
                setLoading(false)
            }
        }    
    },[cursor, hasMore, loading])// depencencies are needed to change the refrence on specific rerendes. 
    // this is because the changes done in the state variable do not automatically comes inside the function which was
    // created on the previous renders. for state variables to get updated the fucntion needs to be recreated and this is 
    // when the refrence of the function change

    useEffect(() => {
        fetchRef.current = fetchLikedSpots;
    }, [fetchLikedSpots]) //fucntion as a dependency in a dependency array means that when ever the function is recreated and refrence is changes the useEffect triggers

    useEffect(() => {
        const observer = new IntersectionObserver(entries => { // a tool provided by the browser to keep an i on screen. as soon as the req html appears on the screen this triggers
            if (entries[0].isIntersecting) { //after the div is visible browser generates a object which is passed to entries, in it there is a field isIntersecting, it turns true when div is visible
                fetchRef.current();
            }
        });
        if (observerRef.current) {
            observer.observe(observerRef.current) // due to this assignment of observer.observe we got an eye on the div and whenever it is inside the viewport it tells the browser and then it triggers the callback function given to it.
        }
        return () => observer.disconnect();
    }, [])

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
            {likedlength} Liked
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
                        {place.spotsLiked[0].spotName[0].toUpperCase()+place.spotsLiked[0].spotName.slice(1) }
                    </h3>
                    <div className="flex items-center gap-1">
                        <span className="
                            px-1 py-0.5
                            rounded-full
                            text-sm font-semibold
                            text-green-700
                        ">
                            {place.spotsLiked[0].likes}
                        </span>

                        <button
                            className="
                            text-green-500
                            transition
                            text-xl
                            leading-none
                            p-0
                            "
                            title="Remove from liked"
                        >
                            ♥
                        </button>
                    </div>
                </div>

                    <div className="flex items-center justify-between">
                    <span className="
                        text-xs font-medium
                        px-3 py-1
                        rounded-full
                        bg-green-50 text-green-700
                    ">
                        Hidden Gem
                    </span>
                    </div>
                </div>
                ))}
            </div>
            <div ref={observerRef}></div> {/*observerRef is a useRef which will be used to store the refrence of this html so that 
                                            whenever it apears on screen the furthur process trigger. 
                                            so here ref is helping provide the ref to the useRef. 
                                            As soon as this div renders the ref is stored in the useref */}
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