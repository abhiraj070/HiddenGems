"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MapComponent from "@/components/map-component"
import SidebarComponent from "@/components/sidebar-component"
import TopNavComponent from "@/components/top-nav-component"
import AddSpotModal from "@/components/add-spot-modal"

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [spots, setSpots] = useState([])
  const [filteredSpots, setFilteredSpots] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedSpot, setSelectedSpot] = useState(null)
  const [pickingLocation, setPickingLocation] = useState(false)
  const [wishlist, setWishlist] = useState([])
  const [locationPicked, setLocationPicked]= useState()
  const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "nature",
        photoUrl: "",
        lat: "",
        lng: "",
    })
  useEffect(() => {
    //getting user data from local storage
    const userdata= localStorage.getItem("user")
    console.log("userdata:",userdata);
    
    console.log(33);
    
    if(!userdata){
      router.push("/auth?mode=login")
      return
    }
    const parseduser= JSON.parse(userdata)
    console.log("parseduser:",parseduser);

    setUser(parseduser)

    const sampleSpots = [
      {
        id: 1,
        name: "Mountain Viewpoint",
        category: "viewpoint",
        lat: 40.7128,
        lng: -74.006,
        description: "Beautiful mountain view with sunset views",
        image: "/mountain-viewpoint.jpg",
      },
      {
        id: 2,
        name: "Local Cafe",
        category: "cafe",
        lat: 40.8088,
        lng: -73.9391,
        description: "Cozy coffee shop with great ambiance",
        image: "/local-cafe.jpg",
        //isFavorite
      },
      {
        id: 3,
        name: "Best Restaurant",
        category: "restaurant",
        lat: 40.7489,
        lng: -73.968,
        description: "Authentic cuisine with outdoor seating",
        image: "/cozy-italian-restaurant.png",
      },
      {
        id: 4,
        name: "Heritage Library",
        category: "library",
        lat: 40.7505,
        lng: -73.9972,
        description: "Historic library with rare collections",
        image: "/grand-library.png",
      },
      {
        id: 5,
        name: "Budget Hostel",
        category: "hostel",
        lat: 41.0534,
        lng: -74.0127,
        description: "Affordable stay with great facilities",
        image: "/hostel.jpg",
      },
    ]

    setSpots(sampleSpots)
    filterSpots(sampleSpots, [])
  }, [router])

  const filterSpots = (spotsToFilter, categories) => {
    if (categories.length === 0) {
      setFilteredSpots(spotsToFilter)
    } else {
      setFilteredSpots(spotsToFilter.filter((spot) => categories.includes(spot.category)))
    }
  }

  const handleCategoryChange = (categories) => {
    setSelectedCategories(categories)
    filterSpots(spots, categories)
  }

  const handleAddSpot = (newSpot) => {
    const addedSpot = {
      ...newSpot,
      id: Math.max(...spots.map((s) => s.id), 0) + 1,
      isFavorite: false,
    }

    const updatedSpots = [...spots, addedSpot]
    setSpots(updatedSpots)
    filterSpots(updatedSpots, selectedCategories)
    setShowAddModal(false)
    setPickingLocation(false)
  }

  const handleToggleFavorite = (spotId) => {
    const updatedSpots = spots.map((spot) => {
      if (spot.id === spotId) {
        return { ...spot, isFavorite: !spot.isFavorite }
      }
      return spot
    })

    setSpots(updatedSpots)
    filterSpots(updatedSpots, selectedCategories)

    if (user) {
      const updatedFavorites = updatedSpots.filter((s) => s.isFavorite).map((s) => s.id)

      const updatedUser = { ...user, favorites: updatedFavorites }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
    }
  }

  const handleLocationPicked = (lat, lng) => {
    console.log("Location picked:", lat, lng)
    setFormData(prev=>({
      ...prev,
      lat: lat,
      lng: lng,
    }))
    setShowAddModal(true)
  }

  if (!user) {
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
            spots={filteredSpots}
            onToggleFavorite={handleToggleFavorite}
            selectedSpot={selectedSpot}
            pickingLocation={pickingLocation}
            onLocationPicked={handleLocationPicked}
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
    </div>
  )
}
