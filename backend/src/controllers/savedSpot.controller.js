import { SavedSpot } from "../models/savedSpot.model.js"
import { Spot } from "../models/spot.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asynchandler } from "../utils/asynchandler.js"

const toggelSaveSpot= asynchandler(async (req,res) => {
    const lat= req.params.lat
    const lng= req.params.lng
    const spot= await Spot.findOne({latitude: lat, longitude: lng})
    //console.log("spot: ",spot)
    if(spot.length===0){
        throw new ApiError(404,"Error while fetching spot")
    }
    const user_id= req.user._id
    if(!user_id){
        throw ApiError(401,"Unathorized Request")
    }
    //console.log("user_id: ",user_id)
    const isAlreadySaved= await SavedSpot.exists({
        savedBy: user_id,
        targetId: spot._id
    })
    //console.log("isAlreadySaved: ",isAlreadySaved);
    if(isAlreadySaved){
        await SavedSpot.findOneAndDelete({
            savedBy: user_id,
            targetId: spot._id
        })
        await User.findByIdAndUpdate(
            user_id,
            {$pull:{savedSpots: spot._id}}
        )
        return res
        .status(200)
        .json(new ApiResponse(200,{},"Spot is already saved"))
    }
    await SavedSpot.create({
        savedBy: user_id,
        targetId: spot._id
    })
    await User.findByIdAndUpdate(
        user_id,
        {$push:{savedSpots: spot._id}}
    )
    return res
    .status(200)
    .json(new ApiResponse(200,{},"Spot saved successfully"))
})

const deleteSavedPlaceById= asynchandler(async (req,res) => {
    const id= req.params.id
    const user_id= req.user._id
    if(!user_id){
        throw ApiError(400,"User not found")
    }
    await User.findByIdAndUpdate(
        user_id,
        {$pull:{savedSpots: id}},
        {new: true}
    )
    await SavedSpot.findOneAndDelete({
        savedBy:user_id,
        targetId: id
    })
    
    return res
    .status(200)
    .json(new ApiResponse(200,{},"Successfully deleted detail by saved place using ID"))
})

export { toggelSaveSpot, deleteSavedPlaceById}