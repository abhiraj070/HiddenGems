"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"

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
  console.log("3. top nav component loaded");
  //console.log("user: ",user);
  

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <nav className="sticky top-0 z-50 bg-sand">
  <div className="w-full py-4">
    <div
      className="
        mx-2 sm:mx-2
        -translate-y-2
        grid grid-cols-[auto_1fr_auto]
        items-center gap-6
        rounded-2xl
        bg-white/80 backdrop-blur
        border border-stone/70
        shadow-[0_6px_18px_-10px_rgba(0,0,0,0.18)]
        px-6 py-3
      "
    >

      <Link
        href="/home"
        className="
          text-2xl font-bold text-gradient tracking-tight
          relative
          after:absolute after:-bottom-1 after:left-0
          after:h-0.5 after:w-0 after:bg-teal
          after:transition-all after:duration-300
          hover:after:w-full
        "
      >
        HiddenGems
      </Link>

      <div className="relative max-w-lg w-full mx-auto group">
        <input
          type="text"
          placeholder="Search gems..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="
            w-full px-5 py-3 rounded-xl
            bg-cream/70
            border border-stone/60
            text-dark-text
            placeholder-dark-text/50
            focus:outline-none
            focus:bg-white
            transition-all duration-200
            shadow-inner
            focus:shadow-[0_0_0_2px_rgba(20,184,166,0.35)]
          "
        />

        <div
          className="
            pointer-events-none
            absolute inset-0 rounded-xl
            opacity-0 group-focus-within:opacity-100
            transition-opacity
            bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.15),transparent_70%)]
          "
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onAddSpot}
          className="
            px-4 py-2.5 rounded-xl
            bg-green-600 text-white hover:bg-green-700
            font-semibold
            shadow-md
            transition-all duration-150
            hover:shadow-lg hover:scale-[1.03]
            active:scale-100
          "
        >
          + Add Gem
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowProfileMenu((v) => !v)}
            className="
              flex items-center gap-2
              px-2 py-2 rounded-xl
              bg-cream/70
              border border-stone/60
              transition-all duration-150
              hover:bg-white hover:shadow-md hover:scale-[1.02]
              focus:outline-none
              focus:shadow-[0_0_0_2px_rgba(20,184,166,0.35)]
            "
          >
            <div className="w-9 h-9 rounded-full overflow-hidden bg-teal ring-2 ring-teal/30">
              <Image
                src={user.profilepicture}
                alt="Profile"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>

            <span className="hidden sm:block text-m font-medium text-dark-text">
              {user.fullname}
            </span>
          </button>

          {/* Dropdown */}
          {showProfileMenu && (
            <div
              className="
                absolute right-0 mt-3 w-52
                bg-white
                border border-stone/60
                rounded-xl
                shadow-xl
                overflow-hidden
                origin-top-right
                animate-in fade-in zoom-in-95
              "
            >
              <Link
                href="/profile"
                onClick={() => setShowProfileMenu(false)}
                className="
                  block px-5 py-3 text-sm text-dark-text
                  hover:bg-cream transition-colors font-semibold
                "
              >
                PROFILE
              </Link>

              <button
                onClick={handleLogout}
                className="
                  w-full text-left px-5 py-3 text-sm text-dark-text
                  hover:bg-cream transition-colors
                  border-t border-stone/60 font-semibold text-red-700 
                "
              >
                LOGOUT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</nav>



  )
}
