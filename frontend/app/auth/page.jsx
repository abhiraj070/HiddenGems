"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useRef } from "react"
import Link from "next/link"
import axios from "axios"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get("mode") || "login"
  const fileInputRef = useRef(null)

  const [isLogin, setIsLogin] = useState(mode === "login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [profilepicture, setprofilepicture] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [username, setUsername] =useState("")

  const handleprofilepictureChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setprofilepicture(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    console.log(13);
    
    try {
      if (isLogin) {
        // Login      
        console.log(11);
          
        const res= await axios.post(
          "/api/v1/users/login",
          {email, username, password},
          { withCredentials: true }
        )
        router.push("/home")
      } else {
        // signup
        console.log(12);
        
        const formData = new FormData(); //sending formdata while register because of a file.
        formData.append("email", email);
        formData.append("fullname", name);
        formData.append("username", username);
        formData.append("password", password);
        formData.append("profilepicture", fileInputRef.current?.files?.[0]);
        const res= await axios.post(
          "/api/v1/users/register", formData)
        router.push("/home")
      }
    } catch (err) {
      console.log("DATA:", err.response?.data);
      console.error("LOGIN ERROR:", err);
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-sand via-cream to-stone flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <Link href="/" className="inline-flex items-center mb-8 gap-2 hover:opacity-80 transition-opacity">
          <div className="text-3xl font-bold text-gradient">HiddenGems</div>
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
                    placeholder="Your Full Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">Profile Picture</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleprofilepictureChange}
                    className="w-full px-4 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-teal bg-cream cursor-pointer"
                  />
                  {profilepicture && (
                    <div className="mt-3 flex justify-center">
                      <img
                        src={profilepicture || "/placeholder.svg"}
                        alt="Profile preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-teal"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-stone rounded-lg focus:outline-none focus:ring-2 focus:ring-teal bg-cream"
                    placeholder=""
                  />
                </div>
                
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">Email</label>
              <input
                type="text"
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
                type="text"
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
