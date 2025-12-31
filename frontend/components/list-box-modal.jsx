"use client"

export default function ListBoxModal({ onClose, allReviews, setShowDetails, setTransferSpecificReview }) {
  //console.log("allReviews: ",allReviews);
  //console.log(("set: ",allReviews[0].reviews));
  
  const handleReviewClick= (val)=>{
    setShowDetails(true)
    setTransferSpecificReview(val)
  }



  return (
    <div className="fixed top-50 right-50 z-50 w-80 rounded-xl bg-white shadow-2xl border border-gray-200">
      
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b bg-linear-to-r from-gray-50 to-gray-100 rounded-t-xl">
        <h3 className="text-sm font-semibold text-gray-800 tracking-wide">
          Reviews
        </h3>

        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full
                     text-gray-500 hover:text-gray-800 hover:bg-gray-200
                     transition cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Scrollable content */}
      <div className="max-h-70 overflow-y-auto px-5 py-4 space-y-3">
        {allReviews[0].reviews.map((val) => (
          <div
            key={val._id}
            onClick={() => handleReviewClick(val)}
            className="p-3 rounded-lg border border-gray-100
                       hover:border-gray-300 hover:bg-gray-50
                       transition cursor-pointer"
          >
            <p className="text-sm font-medium text-gray-800">
              {`${val.tag[0].toUpperCase()+val.tag.slice(1) }`}
            </p>
            <p className="text-xs text-gray-500">
              Click to view details
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
