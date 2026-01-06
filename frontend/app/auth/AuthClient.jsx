"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState,useEffect, useRef } from "react"
import Link from "next/link"
import axios from "axios"
import api from "@/lib/api"

export default function AuthClient() {
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

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    document.body.appendChild(script)
  }, [])

  const handleGoogleLogin = async (credential) => {
    setError("")
    setLoading(true)
    try {
      const res = await axios.post(
        `/${api}/v1/users/google-login`,
        { token: credential },
        { withCredentials: true }
      )

      const user = res.data.data.user
      localStorage.setItem("user", JSON.stringify(user))
      router.push("/home")
    } catch (err) {
      setError(err.response?.data?.message || "Google login failed")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  const script = document.createElement("script")
  script.src = "https://accounts.google.com/gsi/client"
  script.async = true
  script.defer = true

  script.onload = () => {
    if (!window.google) {
      return
    }
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: (response) => {
        handleGoogleLogin(response.credential)
      }
    })
    window.google.accounts.id.renderButton(
    document.getElementById("google-auth-btn"),
    {
      theme: "outline",
      size: "large",
      shape: "circle",
      logo_alignment: "center"
    }
  )
  }
  document.body.appendChild(script)
}, [])

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
    try {
      if (isLogin) {
        // Login      
        const res= await axios.post(
          `/${api}/v1/users/login`,
          {email, password},
          { withCredentials: true }
        )
        const user= res.data.data.user
        //console.log("User: ",user );
        
        localStorage.setItem("user",JSON.stringify(user))
        router.push("/home")
      } else {
        // signup
        const formData = new FormData(); //sending formdata while register because of a file.
        formData.append("email", email);
        formData.append("fullname", name);
        formData.append("username", username);
        formData.append("password", password);
        formData.append("profilepicture", fileInputRef.current?.files?.[0]);
        const res= await axios.post(
          `/${api}/v1/users/register`, formData
        )
        const user= res.data.data
        //console.log("userstr:",res);
        //console.log("user1:",user);
        
        localStorage.setItem("user",JSON.stringify(user))
        //(another method)localStorage.setItem("user",JSON.stringify({name, username, profilepicture}))  //local storage only stores strings so by using json.stringify we convert each element in the object into a valid string which can be stored in the local storage.
        router.push("/home")
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-linear-to-br from-sand via-cream to-stone flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center mb-8 gap-2 hover:opacity-80 transition-opacity">
          <div className="text-3xl font-bold text-gradient">HiddenGems</div>
        </Link>

        <div className="bg-white rounded-lg border border-stone p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-dark-text mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h1>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          )}

          <div className="mb-6 flex flex-col items-center">
            <div id="google-auth-btn"></div> 
            <div className="flex items-center w-full my-4">
              <div className="flex-1 h-px bg-stone-200"></div>
              <span className="px-3 text-sm text-dark-text/50">OR</span>
              <div className="flex-1 h-px bg-stone-200"></div>
            </div>
          </div>


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
        <p className="text-center mt-6 text-dark-text/60">
          <Link href="/" className="hover:text-teal transition-colors">
            ← Back to Home
          </Link>
        </p>
      </div>
      
    </div>
  )
}
