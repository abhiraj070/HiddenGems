"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MapComponent from "@/components/map-component"
import SidebarComponent from "@/components/sidebar-component"
import TopNavComponent from "@/components/top-nav-component"
import AddSpotModal from "@/components/add-spot-modal"
import ListBoxModal from "../../components/list-box-modal"
import SpotDetailsModal from "../../components/spot-details-modal"
import axios from "axios"

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [newspots, setnewSpots] = useState()
  const [dbspots, setdbspots]= useState([])
  const [filteredSpots, setFilteredSpots] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showList, setShowList]= useState(false)
  const [selectedSpot, setSelectedSpot] = useState(null)
  const [wishlist, setWishlist] = useState([])
  const [currentLocation, setCurrentLocation]= useState()
  const [allReviews, setAllReviews]= useState()
  const [showDetails, setShowDetails]= useState(false)
  const [transferSpecificReview, setTransferSpecificReview]= useState()
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
    navigator.geolocation.getCurrentPosition(
      async (position)=>{  //browser runs this callback function when user allows.
        const {latitude, longitude}=position.coords
        //console.log("latitude: ",latitude,"longitude: ",longitude);
        setCurrentLocation({latitude,longitude})
      }
    )
  }, [router]) //[router] dependency is same as [].

  const filterSpots = (spotsToFilter, categories) => {
    if (categories.length === 0) {
      setFilteredSpots(spotsToFilter)
    } else {
      setFilteredSpots(spotsToFilter.filter((spot) => categories.includes(spot.category)))
    }
  }

  const handleCategoryChange = (categories) => {
    setSelectedCategories(categories)
    filterSpots(newspots, categories)
  }

  const handleToggleFavorite = (spotId) => {
    const updatedSpots = spots.map((spot) => {
      if (spot.id === spotId) {
        return { ...spot, isFavorite: !spot.isFavorite }
      }
      return spot
    })

    setnewSpots(updatedSpots)
    filterSpots(updatedSpots, selectedCategories)

    if (user) {
      const updatedFavorites = updatedSpots.filter((s) => s.isFavorite).map((s) => s.id)

      const updatedUser = { ...user, favorites: updatedFavorites }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
    }
  }

  const handleLocationPicked = (lat, lng) => {
    setFormData(prev=>({
      ...prev,
      lat: lat,
      lng: lng,
    }))
    setShowAddModal(true)
  }

  useEffect(()=>{
    const fetchReviews =async ()=>{
    const res= await axios.get(
      `/api/v1/spot/get/spots`,
      { withCredentials: true }
    )
    const reviewGot= res.data.data;
    //console.log("reviews: ",reviewGot);
    console.log("res: ",res);
    setdbspots(reviewGot)    
  }
  fetchReviews()
  },[])

  const handleAddSpot = async (newSpot) => {
    const addedSpot = {
      ...newSpot,
      lat: formData.lat,
      lng: formData.lng,
      isFavorite: false,
    }
    //console.log("addedSpot: ",addedSpot);
    setnewSpots(addedSpot)
    //filterSpots(updatedSpots, selectedCategories)
    setShowAddModal(false)
    let res
    try {
       res= await axios.post(
        "/api/v1/review/createReview",
        {
          spotName: formData.name,
          content: formData.description,
          tag: formData.category,
          latitude: formData.lat,
          longitude: formData.lng
        },
        { withCredentials: true }
      )
    } catch (error) {
      router.push("/")
    }

  }

  if (!user) {
    //console.log("1. displaying loading");
    return <div className="min-h-screen bg-sand flex items-center justify-center">Loading...</div>
  }


  return (
    // a huge screen which will render all its components one by one
    <div className="min-h-screen bg-background">

      {/* all these green texts are components which will render when i run the program */}
      {/* all the things inside the component tag are its props. they will be transfered to the component and do the desired work, like getting some value. */}
      {/* when any of these props update value. the whole home page gets re-rendered */}
      <TopNavComponent 
        user={user} 
        onAddSpot={() => setShowAddModal(true)} 
      />

      <div className="flex h-[calc(100vh-80px)]">
        <SidebarComponent
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          spots={filteredSpots}
          //favorites={user.favorites || []}
          wishlist={wishlist}
          onSelectSpot={setSelectedSpot}
        />

        <div className="flex-1 ml-80">
          <MapComponent
            onToggleFavorite={handleToggleFavorite}
            selectedSpot={selectedSpot}
            onLocationPicked={handleLocationPicked}
            currentLocation={currentLocation}
            dbspots={dbspots}
            newspots={newspots}
            ListBox={setShowList}
            setAllReviews={setAllReviews}
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
      />}

      {showDetails &&
        <SpotDetailsModal
          onClose={()=>{setShowDetails(false)}}
          review={transferSpecificReview}
        />
      }

    </div>

  )
}
