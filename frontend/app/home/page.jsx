"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MapComponent from "@/components/map-component"
import SidebarComponent from "@/components/sidebar-component"
import TopNavComponent from "@/components/top-nav-component"
import AddSpotModal from "@/components/add-spot-modal"
import ListBoxModal from "../../components/list-box-modal"
import SpotDetailsModal from "../../components/spot-details-modal"
import LikeBoxComponent from "../../components/like-box-component"
import axios from "axios"

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [newspots, setnewSpots] = useState(null)
  const [dbspots, setdbspots]= useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showList, setShowList]= useState(false)
  const [selectedSpot, setSelectedSpot] = useState(null)
  const [currentLocation, setCurrentLocation]= useState()
  const [allReviews, setAllReviews]= useState()
  const [showDetails, setShowDetails]= useState(false)
  const [transferSpecificReview, setTransferSpecificReview]= useState()
  const [error, setError]= useState(null)
  const [coordOfSpot, setCoordOfSpot]= useState()
  const [displayFavBox, setDisplayFavBox]= useState(false)
  const [isSpotLiked, setIsSpotLiked]= useState(false)
  const [cursor, setCursor]= useState(null)
  const [likedlength, setLikedLength]= useState(0)

  
  const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "nature",
        photoUrl: "",
        lat: "",
        lng: "",
    })
  useEffect(() => {
    const userdata= localStorage.getItem("user")
    //console.log("userdata:",userdata);
    if(!userdata){
      router.push("/auth?mode=login")
      return
    }
    const parseduser= JSON.parse(userdata)
    //console.log("2. got parsed data and now going for re-render because of setUser");
    //console.log("parseduser:",parseduser)
    setUser(parseduser)
    //to get the current location of the user
      navigator.geolocation.getCurrentPosition( //navigator represents information about user's browser and device and provide access to certain capabilities
        async (position)=>{  //browser runs this callback function when user allows.
          const {latitude, longitude}=position.coords
          //console.log("latitude: ",latitude,"longitude: ",longitude);
          setCurrentLocation({latitude,longitude})
        },
        (error)=>{
          setError(error.message)
        },
        {
          enableHighAccuracy: true, // critical
          timeout: 10000,           // wait up to 10s
          maximumAge: 0             // do NOT use cached location
        }
      )
    
  }, []) 

  const handleLocationPicked = (lat, lng) => {
    setFormData(prev=>({ // prev denotes previous value in FormData
      ...prev,
      lat: lat,
      lng: lng,
    }))
    setShowAddModal(true)
  }

  useEffect(()=>{
    const fetchReviews =async ()=>{
      try {
        const res= await axios.get(
          `/api/v1/spot/get/spots`
        )
        const reviewGot= res.data.data
        //console.log("reviews: ",reviewGot);
        //console.log("res: ",res);
        setdbspots(reviewGot)
        setError(null)
      } catch (error) {
        setError(error.message)
      }    
    }
    fetchReviews()
  },[])

  const handleCategoryChange=()=>{}

  const handleAddSpot = async (newSpot) => {
    const addedSpot = {
      ...newSpot,
      lat: formData.lat,
      lng: formData.lng,
    }
    //console.log("addedSpot: ",addedSpot);
    setnewSpots(addedSpot)
    //filterSpots(updatedSpots, selectedCategories)
    setShowAddModal(false)
    try {
       await axios.post(
        `/api/v1/review/createReview`,
        {
          spotName: formData.name,
          content: formData.description,
          tag: formData.category,
          latitude: formData.lat,
          longitude: formData.lng
        }
      )
      setError(null)
    } catch (error) {
        setError(error.message)
        setnewSpots(null)
    }
  }

  if (!user) {
    //console.log("1. displaying loading");
    return <div className="min-h-screen bg-sand flex items-center justify-center">Loading...</div>
  }


  return (
    // a huge screen which will render all its components one by one
    <div className="h-screen overflow-hidden bg-background">
      {/* all these green texts are components which will render when i run the program */}
      {/* all the things inside the component tag are its props. they will be transfered to the component and do the desired work, like getting some value. */}
      {/* when any of these props update value. the whole home page gets re-rendered */}
      <TopNavComponent 
        user={user} 
        onAddSpot={() => setShowAddModal(true)} 
      />

      <div className="flex h-[calc(100vh-80px)]">
        <SidebarComponent
          onCategoryChange={handleCategoryChange}
          onSelectSpot={setSelectedSpot}
          setDisplayFavBox={setDisplayFavBox}
          isSpotLiked={isSpotLiked}
          displayFavBox={displayFavBox}
          setLikedLength={setLikedLength}
          likedlength={likedlength}

        />

        <div className="flex-1 ml-80 ">
          <MapComponent
            selectedSpot={selectedSpot}
            onLocationPicked={handleLocationPicked}
            currentLocation={currentLocation}
            dbspots={dbspots}
            newspots={newspots}
            ListBox={setShowList}
            setAllReviews={setAllReviews}
            setCoordOfSpot={setCoordOfSpot}
          />
        </div>
      </div>

      {/* all the rendering was going smoothly when a condition arrived that if showAddmodal is true then only addApotModal will be rendered*/}
      {/* heres how the popup components are handeled. if i press the button then only render the component */}
      {showAddModal && 
      <AddSpotModal  
        onClose={() => setShowAddModal(false)} 
        onAddSpot={handleAddSpot} 
        formData={formData}
        setFormData={setFormData} 
        setShowAddModal={setShowAddModal}
      />}

      {showList &&
      <ListBoxModal
        onClose={()=>{setShowList(false)}}
        allReviews={allReviews}
        setShowDetails={setShowDetails}
        setTransferSpecificReview={setTransferSpecificReview}
        coordOfSpot={coordOfSpot}
        setIsSpotLiked={setIsSpotLiked}
        isSpotLiked={isSpotLiked}
      />}

      {showDetails &&
        <SpotDetailsModal
          onClose={()=>{setShowDetails(false)}}
          review={transferSpecificReview}
        />
      }

      {displayFavBox &&
        <LikeBoxComponent
          onClose={()=>{setDisplayFavBox(false)}}
          cursor={cursor}
          setCursor={setCursor}
          likedlength={likedlength}
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
