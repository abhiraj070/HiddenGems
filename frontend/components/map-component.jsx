"use client"

import { useEffect, useRef, useState } from "react"
import axios from "axios"
export default function MapComponent({onLocationPicked, currentLocation, dbspots, newspots, ListBox, setAllReviews, setCoordOfSpot}) {
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
    map.current = L.map(mapContainer.current).setView(
      currentLocation
        ? [currentLocation.latitude, currentLocation.longitude]
        : [25.6395, 85.1038],
      10
    )
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
        const lat= e.latlng.lat
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
      if (marked.current.has(key)) return
      const marker=L.marker([lat,lng]).addTo(map.current)
      marker.on("click",async (e)=>{
        L.DomEvent.stop(e)
        //console.log("15");
        const lati= lat
        const lngi= lng
        //console.log("lat: ",lat,"lng: ",lng);
        const res= await axios.get(
          `/api/v1/spot/get/${lati}/${lngi}`,
          { withCredentials: true }
        )
        const spotAllReviews= res.data.data.allCoordReviews
        //console.log("spotAllReviews: ",spotAllReviews)
        setAllReviews(spotAllReviews)
        ListBox(true)
        setCoordOfSpot({lat: lati,lng: lngi})
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
            const res= await axios.get(
              `/api/v1/spot/get/${lati}/${lngi}`
            )
            const spotAllReviews= res.data.data.allCoordReviews
            setAllReviews(spotAllReviews)
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
    currentLocationMarkerRef.current= L.marker([lat,lng],{icon: currIcon}).addTo(map.current)
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
    />

  )
}