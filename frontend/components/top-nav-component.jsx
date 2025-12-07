"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"

export default function TopNavComponent({ user, onAddSpot }) {
  const router = useRouter()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-sand border-b border-stone shadow-sm z-50 relative">
      <Link href="/home" className="text-3xl font-bold text-gradient hover:opacity-80 cursor-pointer">
        HiddenGems
      </Link>

      <div className="flex-1 max-w-xs mx-8">
        <input
          type="text"
          placeholder="Search gems..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-stone bg-white text-dark-text placeholder-dark-text/50 focus:outline-none focus:ring-2 focus:ring-teal"
        />
      </div>

      <div className="flex items-center gap-4">
        <button onClick={onAddSpot} className="btn-primary cursor-pointer">
          + Add Gem
        </button>

        <div className="relative z-50" ref={menuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone/30 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-teal text-sand flex items-center justify-center font-bold text-sm">
              {/*{user.name.charAt(0).toUpperCase()}*/}
            </div>
            {/* {<span className="text-dark-text font-medium hidden sm:inline">{user.name}</span>} */}
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-stone rounded-lg shadow-lg overflow-hidden z-50">
              <Link
                href="/profile"
                className="block w-full text-left px-4 py-3 hover:bg-cream text-dark-text transition-colors cursor-pointer"
                onClick={() => setShowProfileMenu(false)}
              >
                👤 Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 hover:bg-cream text-dark-text transition-colors border-t border-stone cursor-pointer"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
