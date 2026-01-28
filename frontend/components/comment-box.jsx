import axios from "axios"
import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
export function CommentBox({reviewId, onClose}){
    const [comments, setComments]= useState([])
    const [cursor, setCursor]= useState(null)
    const [hasMore, setHasMore]= useState(true)
    const [input,setInput]= useState("")
    const [userId, setUserId]= useState(null)
    const observerRef= useRef(null)
    const fetchRef= useRef(null)
    const boxRef= useRef(null)
    const fectchCommentsRef= useRef()
    //console.log("id:",reviewId.reviewId);
    //console.log("comment: ",comments);

    useEffect(()=>{
        const parseduser= JSON.parse(localStorage.getItem("user"))
        //console.log("user:",parseduser);
        
        setUserId(parseduser._id)
    },[])
    
    const fetchNewestComment= useCallback(async()=>{
      //console.log("reviewId:",reviewId);
      
      const res= await axios.get(
        `/api/v1/review/get/newcomment/${reviewId}`
      )
      setComments(prev=>[...res.data.data.comment, ...prev])
    },[reviewId])

    useEffect(()=>{
      fectchCommentsRef.current=fetchNewestComment
    },[fetchNewestComment])

    const fectchComments= useCallback( async()=>{
      if(hasMore){
          const url= cursor? `/api/v1/review/get/comments/${reviewId}?cursor=${cursor}&limit=3`: `/api/v1/review/get/comments/${reviewId}?limit=3`
          const res= await axios.get(url)
          setCursor(res.data.data.nextCursor)
          //console.log("res: ",res);
          
          setHasMore(Boolean(res.data.data.nextCursor))
          setComments(prev=>[...prev,...res.data.data.comments])
      }
    },[cursor,hasMore,reviewId])
    
    useEffect(()=>{
      fetchRef.current= fectchComments
    },[fectchComments])

    useEffect(() => {
        const observer = new IntersectionObserver(entries => { 
            if (entries[0].isIntersecting) { 
                fetchRef.current();
                console.log("2");
                
            }
        });
        if (observerRef.current) {
            observer.observe(observerRef.current) 
        }
        return () => observer.disconnect();
    }, [])

    const handleSubmit=async ()=>{
      await axios.post(
        `/api/v1/review/add/comment/${reviewId}`,
        {content: input}
      )
      fectchCommentsRef.current()
      setInput("")
      boxRef.current.scrollTo({ //boxref has ref to the scrollable box. that ref also contains scrolling methods
        top:0,
        behaviour: "smooth"
      })
    }

    const handleCommentDelete=async(id)=>{
      //console.log("1");
      
      await axios.post(
        `/api/v1/review/delete/comment/${id}`
      )
    }

    if(!comments){
      return null
    }

    return(
    <div className="ml-5 w-full -mt-20 max-w-md rounded-2xl border border-gray-200 bg-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl">
      
       <div className="flex items-center border-b border-gray-200 px-5 py-4 text-base font-semibold text-gray-900">
        <span>Comments</span>

        <button
          onClick={onClose}
          className="ml-auto h-8 w-8 rounded-full flex items-center justify-center
                    text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
        >
          ✕
        </button>
      </div>

      <div className=" max-h-75 space-y-2 overflow-y-auto bg-gray-50 px-5 py-2" ref={boxRef}>
        {comments.map((comment) => (
          <div
            key={comment._id}
            className=" group relative rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-green-600 hover:bg-green-50"
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1">

              <div className="flex items-center gap-3 cursor-pointer">
                <Link href={`/profile/${comment.owner._id}`}>
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
                  {comment.owner.profilepicture ? (
                    <img
                      src={comment.owner.profilepicture}
                      alt={comment.owner.username}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 text-m font-medium">
                      {comment.owner.username?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
                </Link>

                {comment.owner._id?.toString() === userId?.toString() && (
                  <button
                    onClick={(e) =>{e.stopPropagation(), handleCommentDelete(comment._id)}}
                    className="
                      absolute top-4 right-4 z-10
                      opacity-0 group-hover:opacity-100
                      transition
                      text-stone-400 hover:text-red-500
                    "
                  >
                    🗑
                  </button>
                )}


                <div className="text-sm font-semibold text-gray-900">
                  {comment.owner.username}
                </div>
              </div>
                
              <div className="text-sm leading-relaxed text-gray-600 pl-13">
                {comment.content}
              </div>

              </div>
            </div>
          </div>
        ))}
        <div ref={observerRef}></div>
      </div>

      <div className="flex gap-2 border-t border-gray-200 bg-white px-3 py-2">
        <textarea
            rows={1}
            placeholder="Write a comment..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); //this prevents the browsers default behaviour of inserting a new line when pressed enter
                handleSubmit();
            }
            }}
            className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-1 text-sm leading-tight outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500/30"
        />

        <button
            onClick={handleSubmit}
            className="h-10 rounded-lg bg-green-600 px-3 text-sm font-semibold leading-none text-white hover:bg-green-700 active:scale-90"
        >
            ➤
        </button>
        </div>

    </div>
    )
}


