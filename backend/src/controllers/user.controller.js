import { User } from "../models/user.model"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"
import { uploadOnCloudinary } from "../utils/cloudinary"
import { asynchandler } from "../utils/asynchandler"


const registerUser= asynchandler(async(req,res)=>{
    const  {fullname, username, password, email}= req.body

    if(!fullname || !username || !email){
        throw new ApiError(400,"FullName, Username and Email are required")
    }
    if(!password ){
        throw new ApiError(400,"Password is required")
    }

    const isUsernameNew=await User.find({username})
    if(isUsernameNew){
        throw new ApiError(400,"Username already taken")
    }

    const isUserNew= await User.findOne({email})
    if(isUserNew){
        throw new ApiError(400,"User Already exist")
    }

    const photoLocalPath= req.file?.profilepicture[0]?.path
    if(!photoLocalPath){
        throw new ApiError(500,"Multer didn't returned the file path in req.file")
    }
    const isUploaded= await uploadOnCloudinary(photoLocalPath)

    const user= await User.create({
        fullname,
        email,
        username: username.toLowercase(),
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

    const isUser=User.findOne({
        username,
        email,
    })

    if(!isUser){
        throw new ApiError(400,"User not Registered")
    }

    const isPasswordCorrect= bcrypt



    return res
    .status(200)
    .json(new ApiResponse(200,isUser,"User logged in successfully"))
})