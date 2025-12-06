import { Review } from "../models/review.model";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asynchandler } from "../utils/asynchandler";

const createReview= asynchandler(async(req,res)=>{
    const {owner, spotName, content, tag}= req.body

    if(!owner || !spotName || !content || !tag){
        throw new ApiError(400,"All the fields are required")
    }
    const createdReview=await Review.create({
        owner,
        spotName,
        content,
        tag
    })

    if(!createdReview){
        throw new ApiError(500,"Something went wrong while creating review")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,createdReview,"Review created successfully"))
})

const editReview= asynchandler(async (req,res) => {
    const {owner, spotName, content, tag}= req.body
    const review_id= req.params.id
    const updatedreview=await Review.findByIdAndUpdate(
        review_id,
        {
            owner:owner ?? undefined,
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