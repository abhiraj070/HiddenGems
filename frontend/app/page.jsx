"use client"

import Link from "next/link"
import { useEffect, useState } from "react"


export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem("user")
    setIsLoggedIn(user)
  }, [])

  const gems = [
    {
      title: "Verant Rooftop Oasis",
      desc: "Hidden urban garden • 2.4 miles",
      img: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
    },
    {
      title: "Whispering Creek",
      desc: "Secluded forest path • 5.1 miles",
      img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
    },
    {
      title: "Neon Underground",
      desc: "Basement cafe • 0.8 miles",
      img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b"
    }
  ]

  const handleLoginClick=()=>{

  }
  
  return (
    <div className="bg-backgroundLight dark:bg-backgroundDark font-display text-charcoal">

      {/* NAVBAR */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur border-b border-primary/10 px-10 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h2 className="text-3xl font-bold text-primary">HiddenGems</h2>

          {isLoggedIn ? (
              <Link href="/home" className="btn-primary text-lg px-8 py-3">
                Explore Map
              </Link>
            ) : (
              <>
                <Link href="/auth?mode=signup" className="btn-primary text-lg px-8 py-3">
                  Get Started
                </Link>
                <Link href="/auth?mode=login" className="btn-outline text-lg px-8 py-3">
                  I Have an Account
                </Link>
              </>
            )}
        </div>
      </header>

      {/* HERO */}
      <section className="pt-32 px-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

        <div className="space-y-8">
          <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold">
            Explore Beyond Maps
          </span>

          <h1 className="text-5xl lg:text-7xl font-black leading-tight">
            Uncover the <span className="text-primary">Unseen.</span>
          </h1>

          <p className="text-charcoal/70 text-lg max-w-xl">
            Join explorers discovering hidden urban secrets worldwide.
          </p>

            <button
              className="
                relative overflow-hidden
                bg-primary text-white font-bold
                px-7 py-3 rounded-xl
                shadow-lg shadow-primary/30
                transition-all duration-300

                hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5
                active:translate-y-0 active:shadow-md

                focus:outline-none focus:ring-4 focus:ring-primary/30
                group
              "
            >
              {isLoggedIn? 
                (<Link className="relative z-10 flex items-center gap-2" href="/home">
                Explore
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>) :
                (<Link className="relative z-10 flex items-center gap-2" href="/auth?mode=signup">
                  Sign In To Explore
                  <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
                </Link>)
              }
              

              {/* hover glow layer */}
              <span className="
                absolute inset-0 bg-white/20 opacity-0 
                group-hover:opacity-100 transition
              "/>
            </button>

        </div>

        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
            className="w-145 h-110 object-cover hover:scale-105 transition duration-700"
          />
        </div>

      </section>

      {/* GEM GRID */}
      <section className="max-w-7xl mx-auto px-10 py-24">

        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold mb-3">
            From Map to Reality
          </h2>
          <p className="text-primary/80 text-lg">
            Community-curated hidden locations
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {gems.map((g, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden group cursor-pointer"
            >
              <div className="h-80 overflow-hidden">
                <img
                  src={g.img}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-bold text-xl">{g.title}</h3>
                <p className="text-primary text-sm">{g.desc}</p>
                <p className="text-charcoal/60 text-sm">
                  Discovered by local explorers
                </p>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* CTA */}
      <section className="bg-primary/10 py-24 text-center px-6">

        <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          The map ends where your{" "}
          <span className="text-primary italic">story begins.</span>
        </h2>

        <p className="text-lg text-charcoal/70 mb-12 max-w-2xl mx-auto">
          Join thousands discovering places the world forgot.
        </p>

      </section>

    </div>
    

  )
}
