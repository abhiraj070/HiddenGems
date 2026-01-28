import { User } from "../models/user.model.js"
import { Spot } from "../models/spot.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { asynchandler } from "../utils/asynchandler.js"
import JWT from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library"
import { Review } from "../models/review.model.js"
import { Like } from "../models/like.model.js"
import { Follow } from "../models/follow.model.js"
import mongoose from "mongoose"
import { SavedSpot } from "../models/savedSpot.model.js"
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
    let isUploaded
    if(photoLocalPath){
        isUploaded= await uploadOnCloudinary(photoLocalPath)
    }
    const user= await User.create({
        fullname,
        email,
        username: username.toLowerCase(),
        password,
        profilepicture: isUploaded?.url || ""
    })
    const userreturn= await User.findById(user._id)
    .select("-password -refreshToken")
    .populate("reviewHistory")
    
    return res
    .status(200)
    .json(new ApiResponse(200, userreturn, "User registered Successfully"))
})

const loginUser= asynchandler(async(req,res)=>{
    //console.log("loginUser: Request received");

    const {email, password}= req.body
    //console.log("loginUser: Email:", email, "Password provided:", !!password);

    if(!email || !password){
        //console.log("loginUser: Missing email or password");
        throw new ApiError(400,"All the fields are required")
    }

    //console.log("loginUser: Finding user with email:", email);
    const normalizedEmail = email.trim().toLowerCase();
    let user;
    try {
        user = await User.findOne({ email: normalizedEmail });
        //console.log("loginUser: User.findOne succeeded");
    } catch (dbError) {
        //console.log("loginUser: User.findOne failed:", dbError);
        throw dbError;
    }
    //console.log("loginUser: User found:", !!user);
    if(!user){
        //console.log("loginUser: User not registered");
        throw new ApiError(400,"User not Registered")
    }

    //console.log("loginUser: Checking if user has password");
    if (!user.password) {
        //console.log("loginUser: User has no password, must login with Google");
        throw new ApiError(400, "Please login using Google")
    }
    
    //console.log("loginUser: Verifying password");
    let isPassCorrect;
    try {
        isPassCorrect = await user.isPasswordCorrect(password);
        //console.log("loginUser: isPasswordCorrect succeeded");
    } catch (passError) {
        console.log("loginUser: isPasswordCorrect failed:", passError);
        throw passError;
    }
    //console.log("loginUser: Password correct:", isPassCorrect);
    if(!isPassCorrect){
        //console.log("loginUser: Incorrect password");
        throw new ApiError(400,"Incorrect Password")
    }

    //console.log("loginUser: Generating tokens");
    let accessToken, refreshToken;
    try {
        accessToken = user.generateAccessToken();
        refreshToken = user.generateRefreshToken();
        //console.log("loginUser: Token generation succeeded");
    } catch (tokenError) {
        //console.log("loginUser: Token generation failed:", tokenError);
        throw tokenError;
    }
    //console.log("loginUser: Tokens generated:", !!accessToken, !!refreshToken);

    if(!accessToken || !refreshToken){
        //console.log("loginUser: Token generation failed");
        throw new ApiError(500,"Issue in generating token")
    }

    //console.log("loginUser: Setting refreshToken on user");
    user.refreshToken=refreshToken

    //console.log("loginUser: Finding logged in user details");
    let loggedInUser;
    try {
        loggedInUser = await User.findById(user._id).select("-password -refreshToken");
        //console.log("loginUser: User.findById succeeded");
    } catch (findError) {
        //console.log("loginUser: User.findById failed:", findError);
        throw findError;
    }
    //console.log("loginUser: Logged in user details found:", !!loggedInUser);

    //console.log("loginUser: Saving user");
    try {
        await user.save({validateBeforeSave: false});
        //console.log("loginUser: User.save succeeded");
    } catch (saveError) {
        //console.log("loginUser: User.save failed:", saveError);
        throw saveError;
    }
    //console.log("loginUser: User saved successfully");

    const options={
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path:"/"
    }

    //console.log("loginUser: Sending response");
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

const googleSignIn=asynchandler(async (req,res) => {
    //console.log("google-login hit");
    //console.log("BODY:", req.body);
    const {token}= req.body
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    const ticket= await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    })
    const payload= ticket.getPayload()
    const user= await User.findOne({email: payload.email})
    const option={
        secure: false,
        httpOnly: true,
        sameSite: "lax",
        path:"/"
    }
    if(user){
        const accessToken= await user.generateAccessToken()
        const refreshToken= await user.generateRefreshToken()
        if(!accessToken || !refreshToken){
            throw new ApiError(500,"Error while creating Tokens")
        }
        user.refreshToken= refreshToken
        await user.save({validateBeforeSave: false})
        const userdocument= await User.findById(user._id).select("-refreshToken -password")
        return res
        .status(200)
        .cookie("accessToken",accessToken,option)
        .cookie("refreshToken",refreshToken,option)
        .json(new ApiResponse(200,{user: userdocument},"Successfully loggined"))
    }
    else{
        const createUser= await User.create({
            email: payload.email,
            fullname: payload.name,
            profilepicture: payload.picture,
            username: payload.email.split("@")[0],
            googleId: payload.sub
        })
        if(!createUser){
            throw new ApiError(500,"Error in creating User account")
        }
        const accessToken= await createUser.generateAccessToken()
        const refreshToken= await createUser.generateRefreshToken()
        createUser.refreshToken= refreshToken
        await createUser.save({validateBeforeSave: false})
        if(!accessToken || !refreshToken){
            throw new ApiError(500,"Error while creating tokens")
        }
        const userdocument= await User.findById(createUser._id).select("-refreshToken -password")
        return res
        .status(200)
        .cookie("accessToken",accessToken,option)
        .cookie("refreshToken",refreshToken,option)
        .json(new ApiResponse(200,{user: userdocument},"Successfully created the user"))
    }
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

// const changeUserDetails= asynchandler(async (req,res)=>{ no use of this controller kyuki mujjhe different handlers use karne padenge different details edit karane ke liye because of onChange(it will trigger the callback function on every key hit)
//     const {username, fullname, bio}= req.body
//     const user_id= req.user._id
//     const updated_details= await User.findByIdAndUpdate(
//         user_id,
//         {
//             username: username ?? undefined, //by this if the user has entered a new field then only it will be updated.
//             fullname: fullname ?? undefined,
//             bio: bio ?? undefined
//         },
//         {new: true}
//     )
//     //console.log(updated_details)
//     if(!updated_details){
//         throw new ApiError(500,"Error while updating user details")
//     }

//     return res
//     .status(200)
//     .json(new ApiResponse(200,updated_details,"User details Updated"))
// }) 

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
        throw new ApiError(400,"Unauthorized request")
    }
    //console.log(user);
    
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

const deleteReview= asynchandler(async (req,res) => {
    const id= req.params.id
    const user_id= req.user._id
    const userdocument= await User.findByIdAndUpdate(
        user_id,
        {$pull:{reviewHistory: id}},
        {new: true}
    )
    const reviewDocument= await Review.findByIdAndDelete(id)
    if(!reviewDocument){
        throw new ApiError(404,"Review not found")
    }
    const spotDocument= await Spot.findOneAndUpdate({latitude: reviewDocument.latitude, longitude: reviewDocument.longitude},{$pull:{reviews: id}},{new: true})

    if(!spotDocument){
        throw new ApiError(404,"No Spot found at recived coordinates")
    }
    if(spotDocument.reviews.length==0){
        await Spot.findByIdAndDelete(spotDocument._id)
    }
    await Like.deleteMany({targetId: spotDocument._id})
    await SavedSpot.deleteMany({targetId: spotDocument._id})
    if(!userdocument){
        throw new ApiError(400,"User not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,userdocument,"Successfully deleted detail by review using ID"))
})

const addBio= asynchandler(async (req,res) => {
    const user_id= req.user._id
    const bio= req.body.bio
    const userdocument= await User.findByIdAndUpdate(
        user_id,
        {bio: bio}
    )
    if(!userdocument){
        throw new ApiError(404,"User not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,userdocument,"Bio successfully updated"))
})
const updateName= asynchandler(async (req,res) => {
    const user_id= req.user._id
    const name= req.body.name
    if(!name){
        throw ApiError(401,"Name is required")
    }
    const userdocument= await User.findByIdAndUpdate(
        user_id,
        {name: name}
    )
    if(!userdocument){
        throw new ApiError(404,"User not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,userdocument,"Bio successfully updated"))
})

const checkIsLikedSaved= asynchandler(async(req,res)=>{
    //console.log("1");
    const lat= req.params.lat
    const lng= req.params.lng
    const {type, id}= req.params
    const user_id= req.user._id
    let target, length
    if(type==="Spot"){
        target= await Spot.findOne({latitude: lat, longitude: lng})
    }
    else{
        target= await Review.findById(id)
        length= target.comments.length
    }
    if(!target){
        throw new ApiError(403,"No Spot on this coordinate")
    }
    const Likedocument= await Like.findOne({
        likedBy: user_id,
        targetId: target._id,
        targetType: `${type}`
    })
    //console.log("like: ",Likedocument);
    
    let savedDocument
    if(type==="Spot"){
        savedDocument= await SavedSpot.exists({  //exists always returns null or the user id
            savedBy: user_id,
            targetId: target._id
        })
    }
    
    const likeresult=(Boolean(Likedocument))
    const savedresult=(Boolean(savedDocument))
    return res
    .status(200)
    .json(new ApiResponse(200,{likeresult: likeresult,savedresult: savedresult, target: target, length: length},"Successfully checked Liked or not"))
})

const getUserDetails= asynchandler(async (req,res) => {
    const user_id= req.user._id
    const user = await User.findById(user_id)
    .populate("savedSpots")
    .populate({
        path: "likedReviews",
        populate: { path: "owner" }
    })
    .populate({
        path: "comments",
        populate: {path: "review"}
    })
    .populate("reviewHistory")

    const followers= await Follow.aggregate([
        {$match:{targetId: user_id}},
        {$sort:{createdAt: -1}},
        {$lookup: {
            from: "users",
            localField: "followerId",
            foreignField: "_id",
            as: "follower"
        }},
        {$unwind: "$follower"}
    ])
    const followings= await Follow.aggregate([
        {$match:{followerId: user_id}},
        {$sort:{createdAt: -1}},
        {$lookup: {
            from: "users",
            localField: "targetId",
            foreignField: "_id",
            as: "following"
        }},
        {$unwind: "$following"}
    ])
    if(!user){
        throw ApiError(400,"User Not Found")
    }
    const userObj= user.toObject() //this convets moongoose Document in palin JS object. because i want to save new fields in the obj but moongose does not lets it go with the res cuz its not in the schema fields
    userObj.followers= followers
    userObj.followings= followings
    return res
    .status(200)
    .json(new ApiResponse(200,{user: userObj},"User fetched successfully"))
})

const getanotherUserDetails=asynchandler(async (req,res) => {
    const userid=req.params.Id
    const userId = new mongoose.Types.ObjectId(userid)// we get strings from the params, we cannot directly compare this with the ids inside mongodb as the storing type is different, so this converts the string into the type in which mongodb stores it.
    if(!userId){
        throw new ApiError(404,"User not found")
    }
    const user= await User.aggregate([
        {$match: {_id: userId}},
        {$lookup:{
            from: "spots",
            localField: "savedSpots",
            foreignField: "_id",
            as: "savedSpots"
        }},
        {$lookup:{
            from: "reviews",
            localField: "reviewHistory",
            foreignField: "_id",
            as: "reviewHistory"
        }}
    ])
    const followings= await Follow.aggregate([
        {$match:{followerId: userId}},
        {$sort: {createdAt:-1}},
        {$lookup: {
            from: "users",
            localField: "targetId",
            foreignField: "_id",
            as: "following"
        }},
        {$unwind:"$following"}// i am using $ here because unwind need to access the value in the key following whereas above in lookup the field name is requied or keys are required because they do not need to access the value they jsut need to compare the names.
    ])
    const followers= await Follow.aggregate([
        {$match:{targetId: userId}},
        {$sort:{createdAt:-1}},
        {$lookup:{
            from: "users",
            localField: "followerId",
            foreignField: "_id",
            as: "follower"
        }},
        {$unwind:"$follower"}
    ])
    if(user.lenght===0){
        throw new ApiError(404,"User not found")
    } 
    user[0].followings= followings, //i am using "user[0]" and not "user" beacuse aggregate returns an array.
    user[0].followers=followers
    return res
    .status(200)
    .json(new ApiResponse(200,{user: user[0]},"Fetched user details successfully"))
})

const toggleFollow= asynchandler(async (req,res) => {
    const usertobefollowed_id= req.params.id
    const userfolloweing_id= req.user._id
    const isFollowing= await Follow.exists({
        targetId: usertobefollowed_id,
        followerId: userfolloweing_id
    })
    if(isFollowing){
        const followDocument= await Follow.findOneAndDelete({
            targetId: usertobefollowed_id,
            followerId: userfolloweing_id
        })
        await User.findByIdAndUpdate(
            userfolloweing_id,
            {$pull:{follow: followDocument._id}},
        )
        return res
        .status(200)
        .json(new ApiResponse(200,{},"Successfully handled follow system"))
    }
    const followDocument= await Follow.create({
        targetId: usertobefollowed_id,
        followerId: userfolloweing_id
    })
    console.log("a: ",followDocument);
    
    await User.findByIdAndUpdate(
        userfolloweing_id,
        {$push:{follow: followDocument._id}},
    )
    await User.findByIdAndUpdate(
        usertobefollowed_id,
        {$push:{follow: followDocument._id}},
    )
    return res
    .status(200)
    .json(new ApiResponse(200,{},"Successfully handled follow system"))
})
export {
    registerUser,
    loginUser,
    logout,
    changePhoto,
    refreshAccessToken,
    changePassword,
    getUserDetails,
    deleteReview,
    addBio,
    checkIsLikedSaved,
    getanotherUserDetails,
    toggleFollow,
    updateName,
    googleSignIn
}