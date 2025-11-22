"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useRef } from "react"
import Link from "next/link"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get("mode") || "login"
  const fileInputRef = useRef(null)

  const [isLogin, setIsLogin] = useState(mode === "login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [profilePicture, setProfilePicture] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicture(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const user = users.find((u) => u.email === email && u.password === password)

        if (!user) {
          setError("Invalid email or password")
          setLoading(false)
          return
        }

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            profilePicture: user.profilePicture || "",
            favorites: user.favorites || [],
          }),
        )

        router.push("/home")
      } else {
        // Signup
        const users = JSON.parse(localStorage.getItem("users") || "[]")

        if (users.some((u) => u.email === email)) {
          setError("Email already exists")
          setLoading(false)
          return
        }

        const newUser = {
          id: Date.now(),
          email,
          password,
          name,
          profilePicture: profilePicture,
          favorites: [],
        }

        users.push(newUser)
        localStorage.setItem("users", JSON.stringify(users))
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            profilePicture: profilePicture,
            favorites: [],
          }),
        )

        router.push("/home")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand via-cream to-stone flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <Link href="/" className="inline-flex items-center mb-8 gap-2 hover:opacity-80 transition-opacity">
          <div className="text-2xl font-bold text-gradient">HiddenGems</div>
        </Link>

        {/* Form Card */}
        <div className="bg-white rounded-lg border border-stone p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-dark-text mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h1>
          <p className="text-dark-text/60 mb-6">
            {isLogin ? "Login to access your discoveries" : "Join HiddenGems to start exploring"}
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                    className="w-full px-4 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-teal bg-cream"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">Profile Picture</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="w-full px-4 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-teal bg-cream cursor-pointer"
                  />
                  {profilePicture && (
                    <div className="mt-3 flex justify-center">
                      <img
                        src={profilePicture || "/placeholder.svg"}
                        alt="Profile preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-teal"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-teal bg-cream"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-teal bg-cream"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 font-semibold disabled:opacity-50"
            >
              {loading ? "Processing..." : isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-text/60 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-teal hover:underline font-semibold cursor-pointer"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>
        </div>

        {/* Back Link */}
        <p className="text-center mt-6 text-dark-text/60">
          <Link href="/" className="hover:text-teal transition-colors">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  )
}
