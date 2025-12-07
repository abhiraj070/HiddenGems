"use client"

import { useEffect, useRef } from "react"

export default function MapComponent() {
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

  const initMap = () => {
    if (!mapContainer.current || map.current) return

    const L = window.L

    map.current = L.map(mapContainer.current).setView([40.7128, -74.006], 10)

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map.current)

    map.current.on("click", (e) => {
      console.log("MAP CLICK RAW:", e.latlng)
      alert(`Clicked at:\nlat: ${e.latlng.lat}\nlng: ${e.latlng.lng}`)
    })
  }

  return (
    <div
      ref={mapContainer}
      style={{
        height: "600px",
        width: "100%",
        border: "2px solid red",
        position: "relative",
        zIndex: 1,
        cursor: "pointer"
      }}
    />
  )
}
