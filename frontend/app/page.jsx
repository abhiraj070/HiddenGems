"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem("user")
    setIsLoggedIn(!!user)
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-br from-sand via-cream to-stone">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-sand/80 backdrop-blur-sm border-b border-stone">
        <div className="text-3xl font-bold text-gradient">HiddenGems</div>
        
      </nav>

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-dark-text mb-6 leading-tight text-balance">
            Discover the World's Hidden Gems
          </h1>
          <p className="text-xl text-dark-text/70 mb-8 leading-relaxed text-balance">
            Explore curated locations, save your favorite spots, and share discoveries with fellow travelers. Every gem
            tells a story.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-cream/50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-dark-text mb-16">Why HiddenGems?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 border border-stone">
              <div className="text-3xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold text-teal mb-3">Interactive Map</h3>
              <p className="text-dark-text/70">
                Explore hidden locations with our beautiful, interactive map interface powered by Leaflet.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 border border-stone">
              <div className="text-3xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold text-teal mb-3">Save Favorites</h3>
              <p className="text-dark-text/70">
                Bookmark your favorite discoveries and build your personalized collection of hidden gems.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 border border-stone">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-teal mb-3">Discover Trends</h3>
              <p className="text-dark-text/70">
                Find trending locations and see what other travelers are adding to their collections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-teal text-sand py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of travelers discovering the world's hidden gems.</p>
          {!isLoggedIn && (
            <Link href="/auth?mode=signup" className="inline-block btn-secondary text-lg px-8 py-3">
              Start Your Adventure
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-text/5 border-t border-stone py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-dark-text/60">
          <p>© 2025 HiddenGems. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
