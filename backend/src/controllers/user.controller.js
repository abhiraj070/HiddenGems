import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { asynchandler } from "../utils/asynchandler.js"
import JWT from "jsonwebtoken"


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

    const loggedInUser= await User.findById(user._id).select("-password -refreshToken")

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
    const delete_rt=await User.updateOne(
        {_id: user_id},
        {$unset: {refreshToken: 1}}
    )
    /*  delete_rt= {
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

const changeUserDetails= asynchandler(async (req,res)=>{
    const {username, fullname, email}= req.body
    
    const user_id= req.user._id
    
    const updated_details= await User.findByIdAndUpdate(
        user_id,
        {
            username: username ?? undefined, //by this if the user has entered a new field then only it will be updated.
            fullname: fullname ?? undefined,
            email: email ?? undefined
        },
        {new: true}
    )
    console.log(updated_details);
    
    if(!updated_details){
        throw new ApiError(500,"Error while updating user details")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,updated_details,"User details Updated"))
})

const changePhoto= asynchandler(async(req,res)=>{
    const localfilePath= req.file?.path

    
    const upload= await uploadOnCloudinary(localfilePath)

    if(!upload){
        throw new ApiError(500,"Something went wrong while uploading the picture")
    }


    const newdoc= await User.findByIdAndUpdate(
        req.user._id,
        {
            profilepicture: upload.url || ""
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, newdoc, "Profile Picture updated successfully"))

})

//this controller will run (endpoint will be hit) when there is error while verifing access token.
// when this endpoint will be hit there can be two sinerios: 1. token expired 2.Unauthorized login attempt
//so it becomes important to verify the user. 
const refreshAccessToken= asynchandler(async(req,res)=>{
    const refreshToken= req.cookies.refreshToken || req.body.refreshToken
    
    const decoded=JWT.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET, {ignoreExpiration: true}) //if the token is expired using ignoreExpiration: true. i can still access the jwt.sign data.

    const user= await User.findById(decoded?._id)
    if(!user){
        throw ApiError(400,"Unauthorized request")
    }
    console.log(user);
    
    const accessToken= user.generateAccessToken()
    const newrefreshToken= user.generateRefreshToken

    const options={
        secure: false,
        path:"/",
        httpOnly: true,
        sameSite: "lax"
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newrefreshToken,options)
    .json(new ApiResponse(200,{accessToken,refreshToken},"Refresh token updated"))
})

const changePassword= asynchandler(async(req,res)=>{
    const {password}= req.body
    const user_id=req.user._id

    const user= await User.findById(user_id)
    user.password=password

    await user.save() //this will trigger the .pre("save") mongoose middleware. 

    return res
    .status(200)
    .json(new ApiResponse(200,user,"Password updated successfully"))
})

const saveASpot= asynchandler(async (req,res) => {
    const spot_id= req.params.id
    const user_id= req.user._id
    const user= await User.findById(user_id)
    user.savedPlaces.push(spot_id)
    await user.save()
    await user.populate("savedPlaces")
    return res
    .status(200)
    .json(new ApiResponse(200,user.savedPlaces,"Spot saved successfully"))
})

const favSpot= asynchandler(async (req,res) => {
    const spot_id= req.params.id
    const user_id= req.user._id
    const user= await User.findById(user_id)
    user.favourite.push(spot_id)
    await user.save()
    await user.populate("favourite")
    return res
    .status(200)
    .json(new ApiResponse(200,user.savedPlaces,"Spot marked favourite successfully"))
})


export {
    registerUser,
    loginUser,
    logout,
    changeUserDetails,
    changePhoto,
    refreshAccessToken,
    changePassword,
    saveASpot,
    favSpot
}