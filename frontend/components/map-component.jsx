"use client"

import { useEffect, useRef } from "react"
export default function MapComponent({onLocationPicked, currentLocation}) {
  const mapContainer = useRef(null) 
  const map = useRef(null) 
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

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])
  //console.log("4. map rendered");
  
  const onMapClick=(lat,lng)=>{
    onLocationPicked(lat,lng)
  }
  
  const initMap = () => {
    if (!mapContainer.current || map.current) return
    const L = window.L
    if (!L) return
    if(currentLocation){
      map.current = L.map(mapContainer.current).setView([currentLocation.latitude, currentLocation.longitude], 10)
    }
    else{
      map.current = L.map(mapContainer.current).setView([70.32, -20.43], 10)
    }
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 20,
    }).addTo(map.current) 
  }

  useEffect(()=>{
    if(!map.current || !mapContainer.current) return
    map.current.setView([currentLocation.latitude, currentLocation.longitude], 10)
  },[currentLocation])

  useEffect(()=>{
    if(!map.current){ 
      return 
    }
    const handler= (e) => {
      onMapClick(e.latlng.lat,e.latlng.lng)
    }
    map.current.on("click", handler) 
    return () =>map.current.off("click",handler) 
  },[map.current])

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
