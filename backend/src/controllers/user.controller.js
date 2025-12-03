import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { asynchandler } from "../utils/asynchandler.js"


const registerUser= asynchandler(async(req,res)=>{
    const  {fullname, username, password, email}= req.body

    if(!fullname || !username || !email){
        throw new ApiError(400,"FullName, Username and Email are required")
    }
    if(!password ){
        throw new ApiError(400,"Password is required")
    }

    const isUsernameNew=await User.find({username})
    if(!isUsernameNew){
        throw new ApiError(400,"Username already taken")
    }

    const isUserNew= await User.findOne({email})
    if(isUserNew){
        throw new ApiError(400,"User Already exist")
    }

    const photoLocalPath= req.file?.path
    if(!photoLocalPath){
        throw new ApiError(400,"Profile picture is required")
    }
    const isUploaded= await uploadOnCloudinary(photoLocalPath)

    const user= await User.create({
        fullname,
        email,
        username: username.toLowerCase(),
        password,
        profilepicture: isUploaded.url || ""
    })

    const userreturn= await User.findById(user._id).select(
        "-password -refreshToken"
    )

    return res
    .status(200)
    .json(new ApiResponse(200, userreturn, "User registered Successfully"))
})

const loginUser= asynchandler(async(req,res)=>{
    const {username, email, password}= req.body

    if(!username || !email){
        throw new ApiError(400,"All the fields are required")
    }

    const user=await User.findOne({
        username,
        email,
    })
    if(!user){
        throw new ApiError(400,"User not Registered")
    }
    console.log(user);
    

    const isPassCorrect= await user.isPasswordCorrect(password)
    if(!isPassCorrect){
        throw new ApiError(400,"Incorrect Password")
    }

    const accessToken= user.generateAccessToken()
    const refreshToken= user.generateRefreshToken()

    if(!accessToken || !refreshToken){
        throw new ApiError(500,"Issue in generating token")
    }

    user.refreshToken=refreshToken

    const loggedInUser= User.findById(user._id).select("-password -refreshToken")

    user.save({validatebeforesave: false})
    const options={
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/"
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200,{
        user: loggedInUser,
        accessToken,
        refreshToken
    },"User logged in successfully"))
})

const logout= asynchandler(async(req,res)=>{
    const user_id= req.user?._id
    const delete_rt= User.updateOne(
        {_id: user_id},
        {$unset: {refreshToken: 1}}
    )
    /*  {
            "acknowledged": true,
            "matchedCount": 1,
            "modifiedCount": 1
        }   
    */
   // so to check whether the delete was successfull or not we need to check modifiedCount.
   if(delete_rt.modifiedCount==0){
        throw new ApiError(500,"Unable to delete refresh Token")
   }
   return res
   .status(200)
   .json(new ApiResponse(200, delete_rt, "User logged out successfully"))
})

export {
    registerUser,
    loginUser,
    logout
}