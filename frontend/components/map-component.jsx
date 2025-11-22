"use client"

import { useEffect, useRef } from "react"

export default function MapComponent({ spots, onToggleFavorite, selectedSpot, pickingLocation, onLocationPicked }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markers = useRef({})

  useEffect(() => {
    if (typeof window === "undefined") return

    // Check if Leaflet is already loaded
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

    // Dynamically load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      link.onload = () => {
        // CSS loaded, now load JS
        loadScript()
      }
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

    if (pickingLocation) {
      map.current.on("click", (e) => {
        onLocationPicked(e.latlng.lat, e.latlng.lng)
      })
    }

    addMarkers()
  }

  const addMarkers = () => {
    if (!map.current || !window.L) return

    const L = window.L

    // Clear existing markers
    Object.values(markers.current).forEach((marker) => {
      map.current.removeLayer(marker)
    })
    markers.current = {}

    spots.forEach((spot) => {
      const icon = L.divIcon({
        html: `<div class="flex items-center justify-center w-10 h-10 rounded-full ${
          spot.isFavorite ? "bg-coral" : "bg-teal"
        } text-white text-lg cursor-pointer hover:scale-125 transition-transform" style="box-shadow: 0 2px 8px rgba(0,0,0,0.2)">
          ${spot.isFavorite ? "❤️" : "📍"}
        </div>`,
        className: "marker",
      })

      const marker = L.marker([spot.lat, spot.lng], { icon })
        .bindPopup(`
          <div class="p-3 min-w-48">
            <h3 class="font-bold text-lg mb-2">${spot.name}</h3>
            <p class="text-sm text-gray-600 mb-3">${spot.description}</p>
            <button class="btn-primary w-full text-sm cursor-pointer" onclick="window.toggleFav(${spot.id})">
              ${spot.isFavorite ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
            </button>
          </div>
        `)
        .addTo(map.current)

      markers.current[spot.id] = marker

      if (selectedSpot?.id === spot.id) {
        marker.openPopup()
      }
    })
  }

  useEffect(() => {
    if (map.current) {
      addMarkers()
    }
  }, [spots])

  // Expose toggle function to window
  useEffect(() => {
    window.toggleFav = (spotId) => {
      onToggleFavorite(spotId)
    }
  }, [onToggleFavorite])

  return (
    <div
      ref={mapContainer}
      className="w-full h-full rounded-lg border border-stone overflow-hidden"
      style={{ height: "100%", width: "100%", zIndex: 1 }}
    />
  )
}
