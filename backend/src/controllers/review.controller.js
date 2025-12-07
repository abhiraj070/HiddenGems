import { Review } from "../models/review.model.js";
import { Spot } from "../models/spot.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

const createReview= asynchandler(async(req,res)=>{
    const {spotName, content, tag, latitude, longitude}= req.body

    if(!spotName || !content || !tag){
        throw new ApiError(400,"All the fields are required")
    }
    const owner= req.user._id
    const createdReview=await Review.create({
        owner,
        spotName,
        content,
        tag,
        latitude,
        longitude
    })
    req.user.reviewHistory.push(createdReview)
    req.user.save()

    const isSpot=await Spot.findOne({
        latitude,
        longitude
    })

    let task

    if(!isSpot){
        task= await Spot.create({
            spotName,
            latitude,
            longitude,
            reviews:[createdReview._id]
        })
    }
    else{
        await isSpot.reviews.push(createdReview._id)
        await isSpot.save()
        task= isSpot
    }

    await task.populate("reviews")

    if(!createdReview){
        throw new ApiError(500,"Something went wrong while creating review")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,{createdReview, task},"Review created successfully"))
})

const editReview= asynchandler(async (req,res) => {
    const {spotName, content, tag}= req.body
    const review_id= req.params.id
    const updatedreview=await Review.findByIdAndUpdate(
        review_id,
        {
            spotName: spotName ?? undefined,
            content: content ?? undefined,
            tag: tag ?? undefined
        },
        {new: true}
    )

    if(!updatedreview){
        throw new ApiError(500,"Review not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,updatedreview,"Review updated successfully"))
})

const deleteReview= asynchandler(async (req,res) => {
    const review_id= req.params.id
    const deletedReview= await Review.findByIdAndDelete(review_id)
    if(!deletedReview){
        throw new ApiError(404,"review not found or already deleted")
    }

    //delete spot.

    return res
    .status(200)
    .json(new ApiResponse(200,deletedReview,"Review deleted successfully"))
})

const getUserReview= asynchandler(async (req,res) => {
    const user_id= req.params.id
    const user= await User.findById(user_id)
    if(!user){
        throw new ApiError(404,"User not found")
    }
    await user.populate("reviewHistory")
    
    const reviews= user.reviewHistory
    
    return res
    .status(200)
    .json(new ApiResponse(200,reviews,"Successfully fetched user's review"))
})
export {
    createReview,
    editReview,
    deleteReview,
    getUserReview
}