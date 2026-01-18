import { SavedSpot } from "../models/savedSpot.model.js"
import { Spot } from "../models/spot.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asynchandler } from "../utils/asynchandler.js"

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
    const isAlreadySaved= await SavedSpot.exists({
        savedBy: user_id,
        targetId: spot._id
    })
    //console.log("isAlreadySaved: ",isAlreadySaved);
    if(isAlreadySaved){
        return res
        .status(200)
        .json(new ApiResponse(200,req.user.savedSpots,"Spot is already saved"))
    }
    const user= await User.findById(user_id)
    user.savedSpots.push(spot._id)
    await user.save()
    await user.populate("savedSpots")
    return res
    .status(200)
    .json(new ApiResponse(200,user.savedSpots,"Spot saved successfully"))
})

const deleteSavedPlaceById= asynchandler(async (req,res) => {
    const id= req.params.id
    const user_id= req.user._id
    const userdocument= await User.findByIdAndUpdate(
        user_id,
        {$pull:{savedSpots: id}},
        {new: true}
    )
    if(!userdocument){
        throw ApiError(400,"User not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,userdocument,"Successfully deleted detail by saved place using ID"))
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
        {$pull: {savedSpots: spot_id}},
        {new: true}
    )
    return res
    .status(200)
    .json(new ApiResponse(200,updatedUser,"Spot deleted successfully"))
})

export { saveASpot, deleteSavedPlaceById, removeSavedSpot}