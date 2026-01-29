import { Review } from "../models/review.model.js"
import { Spot } from "../models/spot.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asynchandler } from "../utils/asynchandler.js"

const getSpotBox= asynchandler(async (req,res)=>{
    const lat= req.params.lat
    const lng= req.params.lng
    const reviewDocument= await Review.find({latitude: lat, longitude: lng}).sort({likes:-1})
    const allCoordReviews= await Spot
    .findOneAndUpdate({latitude: lat, longitude: lng}, {spotName: reviewDocument[0].spotName})
    .populate(
        {path: "reviews", 
            populate: {path: "owner"},
            options :{sort:{likes: -1}}
        })
        console.log("reviews:",allCoordReviews);
        
    if(allCoordReviews.length === 0){
        throw new ApiError(500,"something went wrong will fetching the reviews")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, {allCoordReviews: allCoordReviews}, "Coordinate reviews fetched successfully"))
})

const getAllSpots=asynchandler(async(req,res)=>{
    //console.log("Collection:", Spot.collection.name);
    //console.log("getAllSpots: controller entered");
    const {ne, sw}= req.body
    //console.log("ne:",ne,"sw:",sw);
    //console.log("1");
    
    
    const allSpots= await Spot.aggregate([
        {$match:{
            latitude: {$gte: sw.lat, $lte:ne.lat},
            longitude: {$gte:sw.lng, $lte: ne.lng}
        }},
    ])
    //console.log(allSpots);

    if(allSpots.length===0){
        throw new ApiError(500,"Error while fetching spots")
    }
    
    //console.log("getAllSpots: spots length =", allSpots.length);
    return res
    .status(200)
    .json(new ApiResponse(200,allSpots,"successfully fetched all spots"))
})

const getSelectedSpot= asynchandler(async (req,res) => {
    
})

export {getSpotBox, getAllSpots}