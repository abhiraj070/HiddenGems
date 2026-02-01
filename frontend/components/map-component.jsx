"use client"

import { useEffect, useRef, useState } from "react"
import axios from "axios"
import "leaflet/dist/leaflet.css"
export default function MapComponent({onLocationPicked, currentLocation, newspots, ListBox, setAllReviews, setCoordOfSpot, initializeSearch, place}) {
  const mapContainer = useRef(null) 
  const map = useRef(null) 
  const marked= useRef(new Set())// created a set here to avoid storing duplicates while storing
  const dbMarkersRef = useRef([])
  const [mapready, setMapReady]= useState(false)
  const [error, setError]= useState(null)
  const currentLocationMarkerRef = useRef(null)
  const [dbspots, setdbspots]= useState([])
  const [mapMoved, setMapMoved]= useState(false)
  //console.log("p1:",place);
  //console.log("in",initializeSearch);
  
  useEffect(() => {
    const initMap = async() => {
      const L = (await import("leaflet")).default //dynamic import of leaflet because at the beginning window is not present.

      delete L.Icon.Default.prototype._getIconUrl //default code in order to make the marker visible
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })
      if (map.current) return
      map.current = L.map(mapContainer.current).setView(
        currentLocation
          ? [currentLocation.latitude, currentLocation.longitude]
          : [28.626, 77.213],
        10
      )
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {// OSM is the place where we get the whole map from, it is like a wikipidea for maps. and leaftet adds all the features in on the map like zoom, markers, popups, etc. it is like a brain for the maps
        maxZoom: 20,
      }).addTo(map.current)
      setMapReady(true)
    }
    initMap()
  }, [])
  
  const onMapClick=(lat,lng)=>{
    onLocationPicked(lat,lng)
  }

  useEffect(()=>{
    const moveMap= async()=>{
      if(!map.current) return
    const getCoordOfPlace = async (place)=>{
      //console.log("place",place)

      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`
      const res= await axios.get(url)
      if(!res.data.length){
        alert("Place not found")
        return null
      }
      //console.log("res:",res)
      
      return {
        lat: parseFloat(res.data[0].lat),
        lng: parseFloat(res.data[0].lon)
      }
    }
    const result= await getCoordOfPlace(place)
    if(!result){
      return
    }
    //console.log("result:",result)

    
    map.current.flyTo([result.lat, result.lng],16)
    const currIcon= L.icon({
      iconUrl: "/loc.png",
      iconSize: [55, 60],
    })
    L.marker([result.lat, result.lng],{icon: currIcon}).addTo(map.current).bindPopup(`${place}`).openPopup()
    }
    moveMap()
    
  },[initializeSearch])
  
  //onclick for addspots to open
  useEffect(()=>{
      if(!map.current){ 
        return 
      }
      //console.log("2");
      
      const handler= (e) => {
        const lat= e.latlng.lat
        const lng= e.latlng.lng
        //console.log("5");
        
        onMapClick(lat,lng)
      }
      map.current.on("click", handler)
    return () => {
      map.current.off("click", handler)
    }
  },[mapready]) 

  useEffect(()=>{
    if(!map.current) return
    map.current.on("moveend zoomend",()=>{
      //console.log("4");
      setMapMoved(prev => !prev)
    })
  },[mapready])

  useEffect(()=>{
    if(!map.current) return
    const bounds= map.current.getBounds()
    const ne={
      lat: bounds.getNorthEast().lat,
      lng: bounds.getNorthEast().lng
    }
    const sw={
      lat: bounds.getSouthWest().lat,
      lng: bounds.getSouthWest().lng
    }
    //console.log("ne:",ne,"sw",sw);
    const fetchReviews =async ()=>{
      try {
        const res= await axios.post(  
          `/api/v1/spot/get/spots`,
          {ne: ne, sw: sw},
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
  },[mapMoved])

  // database reviews marker and onclick for box adding 
  useEffect(()=>{
    if (!map.current || !window.L ) return
    dbspots.forEach((val)=>{
      const lat=val.latitude
      const lng=val.longitude
      const key=`${lat},${lng}`
      if (marked.current.has(key)) return
      const marker=L.marker([lat,lng]).addTo(map.current)
      marker.on("click",async (e)=>{
        L.DomEvent.stop(e)
        //console.log("15");
        const lati= lat
        const lngi= lng
        //console.log("lat: ",lat,"lng: ",lng);
        try {
          const res= await axios.get(
            `/api/v1/spot/get/${lati}/${lngi}`,
            { withCredentials: true }
          )
          //console.log("spotAllReviews: ",res.data.data.allCoordReviews)
          setError(null)
          setAllReviews(res.data.data.allCoordReviews)
        } catch (error) {
          setError(error.message)
        }
        setCoordOfSpot({lat: lati,lng: lngi})
        ListBox(true)
      })
      dbMarkersRef.current.push(marker)
      marked.current.add(key)
    })
    return () => {
      dbMarkersRef.current.forEach((m) => {
        m.off()
        m.remove()
      })
      dbMarkersRef.current = []
      marked.current.clear()
    }
  },[dbspots])
  
  // // new current reviews marker and onclick for box adding
   useEffect(()=>{
     if (!map.current || !window.L || !newspots) return
     const addmarker=()=>{
       const lat=newspots.lat
       const lng=newspots.lng
       const key= `${lat},${lng}`
       if(!marked.current.has(key)){
          const marker=L.marker([lat,lng]).addTo(map.current)
          //console.log("marked");
          marker.on("click",async (e)=>{
            L.DomEvent.stop(e)
            const lati=lat
            const lngi=lng
            try {
              const res= await axios.get(
                `/api/v1/spot/get/${lati}/${lngi}`
              )
              const spotAllReviews= res.data.data.allCoordReviews
              setAllReviews(spotAllReviews)
              setError(null)
            } catch (error) {
              setError(error.message)
            }
            ListBox(true)            
            setCoordOfSpot({lat: lati,lng: lngi})
         })
         marked.current.add(key)
       }
     }
     addmarker()
   },[newspots])

  //current location marker adding
  useEffect(()=>{
    if(!map.current || !mapContainer.current || !currentLocation) return
    const lat= currentLocation.latitude;
    const lng= currentLocation.longitude;
    if(currentLocationMarkerRef.current){
      currentLocationMarkerRef.current.remove()
    }
    const currIcon= L.icon({
      iconUrl: "/curricon2.png",
      iconSize: [55, 60],
    })
    map.current.setView([lat, lng], 10)
    currentLocationMarkerRef.current= L.marker([lat,lng],{icon: currIcon}).addTo(map.current).bindPopup("Your Location").openPopup()
  },[currentLocation, mapready])

  return (
    <div
      ref={mapContainer}
      style={{
        height: "592px",
        width: "calc(100% - 48px)",
        marginLeft: "38px",
        marginRight: "16px",
        position: "relative",
        zIndex: 1,
        cursor: "pointer",
        borderRadius: "24px",
        overflow: "hidden",
        background: "linear-gradient(180deg, #ffffff, #f9fafb)",
        border: "1px solid rgba(120,120,120,0.25)",
        boxShadow: `
          0 20px 40px -20px rgba(0,0,0,0.35),
          inset 0 0 0 1px rgba(255,255,255,0.6)
        `,
        transition: "box-shadow 200ms ease, transform 200ms ease",
        marginTop: "-18px",
      }}
      >
        {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded">
          {error}
        </div>
      )}
      </div>
  )
}