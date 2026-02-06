import { Review } from "../models/review.model.js"
import { Spot } from "../models/spot.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asynchandler } from "../utils/asynchandler.js"

const getSpotBox= asynchandler(async (req,res)=>{
    const lat= parseFloat(req.params.lat)
    const lng= parseFloat(req.params.lng)

    const doc= await Review.aggregate([
        {$match:{latitude: lat, longitude: lng}},
        {$group:{ //what group does is it clubs all the objects with same key(_id) and side by side does some calculation. use this only when you wahat to cub the data
            _id: "$tag",
            count: {$sum: 1}
        }},
        // {$group:{
        //     _id: null,
        //     countSet: {$addToSet: "$count"},  //addtoset adds the value given in a set and that set is treated as array. i.e: countSet will be an array at the end.
        //     allTags: {$push:"$$ROOT"}  //$$ROOT gives the whole document flowing throught the pipeline. allTags will contain array of all the objects
        // }},
        // {$project:{ //project is used to redefine/modify the output document/s
        //     //isSame:{$eq :[{$size:"$countSet"}, 1]}, //if size of countset is 1 this will return true else false
        //     allTags:{
        //         $slice:[{ //slice will return here only the topmost element. cannot use $limit here
        //             $sortArray:{ //sort array is used to sort array, here in this case beacuse i gave a field in the sortBy it will sort it accordind to the count. and store it int he allTags.
        //                 input:"$allTags",
        //                 sortBy: {count:-1}
        //             }
        //         },1]
        //     }
        // }},
        {$sort:{count:-1}},
        {$limit: 1}
    ])
    console.log("doc", doc)
    console.log("doc:", doc[0]._id)
    
    const reviewDocument= await Review.find({latitude: lat, longitude: lng}).sort({likes:-1})
    const allCoordReviews= await Spot
    .findOneAndUpdate({latitude: lat, longitude: lng}, {spotName: reviewDocument[0].spotName, tag: doc[0]._id})
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
    //console.log("getAllSpots: spots length =", allSpots.length);
    return res
    .status(200)
    .json(new ApiResponse(200,allSpots,"successfully fetched all spots"))
})

const getSelectedSpot= asynchandler(async (req,res) => {
    console.log("body:",req.body);
    
    const {cats}= req.body
    if(!cats){
        return new ApiError(401,"No category selected")
    }
    const spots= await Spot.aggregate([
        {$match:{ 
            $or:[
                {tag: {$in: cats}}, //this is the way we match when the data is an array.
                {spotName: {$in: cats.map(c=>new RegExp(c,"i"))}} //regular expression(regexp)o=is a smart text matcher. here it will check for c word in the whole spotName. regex is a class jsut like array.
            ]
        }}, 
    ])
    //console.log("spots",spots);
    
    return res
    .status(200)
    .json(new ApiResponse(200,spots,"fetched selected spots successfully"))
})



export {getSpotBox, getAllSpots, getSelectedSpot}