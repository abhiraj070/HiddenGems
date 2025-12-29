"use client"

import { useEffect, useRef } from "react"
export default function MapComponent({onLocationPicked, currentLocation, dbspots, newspots}) {
  const mapContainer = useRef(null) 
  const map = useRef(null) 
  const marked= useRef([])
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
  //console.log("4. map rendered");
  
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
  }

  const setMarker=(val)=>{
    
  }
  useEffect(()=>{
    dbspots.map((val,idx)=>{
      const lat=val.latitude
      const lng=val.longitude
      if(!marked.current.includes([lat,lng])){
        L.marker([lat,lng]).addTo(map.current)
        marked.current.push([lat,lng])
      }
    })
  },[dbspots])

  useEffect(()=>{
    newspots.map((val,idx)=>{
      const lat=val.lat
      const lng=val.lng
      if(!marked.current.includes([lat,lng])){
        L.marker([lat,lng]).addTo(map.current)
        marked.current.push([lat,lng])
      }
    })
  },[newspots])

  useEffect(()=>{
    if(!map.current || !mapContainer.current || !currentLocation) return
    const lat= currentLocation.latitude;
    const lng= currentLocation.longitude;

    const currIcon= L.icon({
      iconUrl: "/curricon2.png",
      iconSize: [55, 60],

    })

    map.current.setView([lat, lng], 10)
    L.marker([lat,lng],{icon: currIcon}).addTo(map.current)
  },[currentLocation])

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
