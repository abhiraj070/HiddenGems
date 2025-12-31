import { Spot } from "../models/spot.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asynchandler } from "../utils/asynchandler.js"

const getSpotBox= asynchandler(async (req,res)=>{
    const lat= req.params.lat
    const lng= req.params.lng
    const allCoordReviews= await Spot
    .find({latitude: lat, longitude: lng})
    .populate("reviews")
    if(allCoordReviews.length === 0){
        throw new ApiError(500,"something went wrong will fetching the reviews")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, {allCoordReviews: allCoordReviews}, "Coordinate reviews fetched successfully"))
})

export {getSpotBox}