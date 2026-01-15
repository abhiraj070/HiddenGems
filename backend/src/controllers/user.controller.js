import { User } from "../models/user.model.js"
import { Spot } from "../models/spot.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { asynchandler } from "../utils/asynchandler.js"
import JWT from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library"
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
    console.log("google-login hit");
    console.log("BODY:", req.body);
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
        throw ApiError(400,"Unauthorized request")
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

const saveASpot= asynchandler(async (req,res) => {
    const lat= req.params.lat
    const lng= req.params.lng
    const spot= await Spot.findOne({latitude: lat, longitude: lng})
    //console.log("spot: ",spot)
    if(spot.length===0){
        throw new ApiError(404,"Error while fetching spot")
    }
    const user_id= req.user._id
    //console.log("user_id: ",user_id)

    const isAlreadySaved= await User.exists({
        _id: user_id,
        savedPlaces: spot._id
    })
    //console.log("isAlreadySaved: ",isAlreadySaved);
    
    if(isAlreadySaved){
        return res
        .status(200)
        .json(new ApiResponse(200,req.user.savedPlaces,"Spot is already saved"))
    }
    const user= await User.findById(user_id)
    user.savedPlaces.push(spot._id)
    await user.save()
    await user.populate("savedPlaces")
    return res
    .status(200)
    .json(new ApiResponse(200,user.savedPlaces,"Spot saved successfully"))
})

const removeSavedSpot= asynchandler(async (req,res)=>{
    const lat= req.params.lat
    const lng= req.params.lng
    const spot= await Spot.find({latitude: lat,longitude: lng})
    if(spot.length===0){
        throw new ApiError(404,"Error while fetching Spot")
    }
    const spot_id= spot[0]._id
    const user_id= req.user._id
    const updatedUser= await User.findByIdAndUpdate(user_id,
        {$pull: {savedPlaces: spot_id}},
        {new: true}
    )
    return res
    .status(200)
    .json(new ApiResponse(200,updatedUser,"Spot deleted successfully"))
})

const getUserDetails= asynchandler(async (req,res) => {
    const user_id= req.user._id
    const user= await User.findById(user_id).select("-password -refreshToken").populate("savedPlaces reviewHistory followers following")
    if(!user){
        throw ApiError(400,"User Not Found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,{user: user},"User fetched successfully"))
})

const deleteReview= asynchandler(async (req,res) => {
    const id= req.params.id
    const user_id= req.user._id
    const userdocument= await User.findByIdAndUpdate(
        user_id,
        {$pull:{reviewHistory: id}},
        {new: true}
    )
    if(!userdocument){
        throw ApiError(400,"User not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,userdocument,"Successfully deleted detail by review using ID"))
})

const deleteSavedPlaceById= asynchandler(async (req,res) => {
    const id= req.params.id
    const user_id= req.user._id
    const userdocument= await User.findByIdAndUpdate(
        user_id,
        {$pull:{savedPlaces: id}},
        {new: true}
    )
    if(!userdocument){
        throw ApiError(400,"User not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,userdocument,"Successfully deleted detail by saved place using ID"))
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
    const lat= req.params.lat
    const lng= req.params.lng
    const user_id= req.user._id
    const spot= await Spot.findOne({latitude: lat, longitude: lng})
    if(!spot){
        throw new ApiError(404,"No Spot on this coordinate")
    }
    const userdocument= await User.exists({
        _id: user_id,
        favourite: spot._id
    })
    const userdocument2= await User.exists({  //exists always returns null or the user id
        _id: user_id,
        savedPlaces: spot._id
    })
    const likeresult=(Boolean(userdocument))
    const savedresult=(Boolean(userdocument2))
    return res
    .status(200)
    .json(new ApiResponse(200,{likeresult: likeresult,savedresult: savedresult, spot: spot},"Successfully checked Liked or not"))
})

const getUserFavSpots= asynchandler(async (req,res) => {
    const user_id= req.user._id
    //console.log(("USer:",user_id));
    
    const user= await User.findById(user_id).select("-password -refreshToken").populate("favourite")
    const likedSpots= user.favourite
    if(!likedSpots){
        throw new ApiError(404,"User not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,likedSpots,"Successfully fetched user's liked spots"))
})

const getanotherUserDetails=asynchandler(async (req,res) => {
    const userId=req.params.Id
    if(!userId){
        throw new ApiError(404,"User not found")
    }
    const user= await User.findById(userId).populate("reviewHistory savedPlaces followers following").select("-refreshToken -password")
    if(!user){
        throw new ApiError(404,"User not found")
    } 
    return res
    .status(200)
    .json(new ApiResponse(200,{user: user},"Fetched user details successfully"))
})

const isFollowing=asynchandler(async (req,res) => {
    const user_id= req.params.id
    const curruser_id= req.user._id
    const isSame= !(user_id==curruser_id)
    if(!user_id){
        throw new ApiError(404,"Secondary user not found")
    }
    const userdocument= await User.exists({
        _id: curruser_id,
        following: user_id
    })
    const result=Boolean(userdocument)    
    //console.log("followers2: ",user.followers);
    return res
    .status(200)
    .json(new ApiResponse(200,{isFollowing: result, isSame: isSame},"User's following confirmed successfully"))
})

const addAFollowerFollowing= asynchandler(async (req,res) => {
    const usertobefollowed_id= req.params.id
    const userfolloweing_id= req.user._id
    const user1= await User.findByIdAndUpdate(
        usertobefollowed_id,
        {$push: {followers: userfolloweing_id}},
        {new: true}
    )
    const user2= await User.findByIdAndUpdate(
        userfolloweing_id,
        {$push:{following: usertobefollowed_id}},
        {new: true}
    )
    return res
    .status(200)
    .json(new ApiResponse(200,{user: user1, follower: user2},"Successfully handled follow system"))
})

const removeAFollowerFollowing= asynchandler(async (req,res) => {
    const usertobeunfollowed_id= req.params.id
    const userunfolloweing_id= req.user._id
    const user1= await User.findByIdAndUpdate(
        usertobeunfollowed_id,
        {$pull: {followers: userunfolloweing_id}},
        {new: true}
    )
    const user2= await User.findByIdAndUpdate(
        userunfolloweing_id,
        {$pull:{following: usertobeunfollowed_id}},
        {new: true}
    )
    return res
    .status(200)
    .json(new ApiResponse(200,{user: user1, unfollower: user2},"Successfully handled unfollow system"))
})

export {
    registerUser,
    loginUser,
    logout,
    changePhoto,
    refreshAccessToken,
    changePassword,
    saveASpot,
    removeSavedSpot,
    getUserDetails,
    deleteReview,
    deleteSavedPlaceById,
    addBio,
    checkIsLikedSaved,
    getUserFavSpots,
    getanotherUserDetails,
    isFollowing,
    addAFollowerFollowing,
    removeAFollowerFollowing,
    updateName,
    googleSignIn
}