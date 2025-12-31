"use client"

import { useEffect, useRef, useState } from "react"
import axios from "axios"
export default function MapComponent({onLocationPicked, currentLocation, dbspots, newspots, ListBox, setAllReviews}) {
  const mapContainer = useRef(null) 
  const map = useRef(null) 
  const marked= useRef(new Set())
  const dbMarkersRef = useRef([])
  const [mapready, setMapReady]= useState(false)
  const currentLocationMarkerRef = useRef(null)
  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.L) {
      initMap()
      return
    }

    const loadScript = () => {
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.async = true
      script.onload = initMap
      document.body.appendChild(script)
    }

    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      link.onload = loadScript
      document.head.appendChild(link)
    } else {
      loadScript()
    }

  }, [])
  
  const onMapClick=(lat,lng)=>{
    onLocationPicked(lat,lng)
  }
  
  const initMap = () => {
    if (map.current) return
    const L = window.L
    if (!L) return
    if(currentLocation){
      map.current = L.map(mapContainer.current).setView([currentLocation.latitude, currentLocation.longitude], 10)
    }
    else{
      map.current = L.map(mapContainer.current).setView([25.6395, 85.1038], 10)
    }
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 20,
    }).addTo(map.current) 
    setMapReady(true)
  }

  //onclick for addspots to open
  useEffect(()=>{
      if(!map.current){ 
        return 
      }
      const handler= (e) => {
        const lat=e.latlng.lat
        const lng= e.latlng.lng
        onMapClick(lat,lng)
      }
      map.current.on("click", handler)
    return () => {
      map.current.off("click", handler)
    }
  },[mapready]) 

  // database reviews marker and onclick for box adding 
  useEffect(()=>{
    if (!map.current || !window.L ) return
    dbspots.forEach((val)=>{
      const lat=val.latitude
      const lng=val.longitude
      const key=`${lat},${lng}`
      const marker=L.marker([lat,lng]).addTo(map.current)
      marker.on("click",async (e)=>{
        L.DomEvent.stopPropagation(e)
        //console.log("15");
        ListBox(true)
        const lati= e.latlng.lat
        const lngi= e.latlng.lng
        const res= await axios.get(
          `/api/v1/spot/get/${lati}/${lngi}`,
          { withCredentials: true }
        )
        const spotAllReviews= res.data.data.allCoordReviews
        console.log("spotAllReviews: ",spotAllReviews)
        
        setAllReviews(spotAllReviews)
      })
      dbMarkersRef.current.push(marker)
      marked.current.add(key)
    })
    return () => {
      dbMarkersRef.current.forEach((m) => m.remove())
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
         marker.on("click",(e)=>{
            L.DomEvent.stop(e)
            ListBox(true)
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
    currentLocationMarkerRef.current= L.marker([lat,lng],{icon: currIcon}).addTo(map.current)
  },[currentLocation])

  return (
    <div
      ref={mapContainer}
      style={{
        height: "600px",
        width: "100%",
        border: "2px solid red",
        position: "relative",
        zIndex: 1,
        cursor: "pointer",
        borderRight: "5%"
      }}
    />
  )
}