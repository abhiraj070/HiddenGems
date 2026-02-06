import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
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
            reviews:[createdReview._id],
            tag: createdReview.tag
        })
    }
    else{
        isSpot.reviews.push(createdReview._id)
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
    const {review}= req.body
    //console.log(review);
    
    const review_id= req.params.id
    const updatedreview=await Review.findByIdAndUpdate(
        review_id,
        {
            content: review,
        },
        {new: true}
    )

    if(!updatedreview){
        throw new ApiError(404,"Review not found")
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

const getAllcomments= asynchandler(async (req,res) => {
    //console.log("1");
    const {cursor,limit}= req.query
    //console.log("2");
    const reviewId= req.params.Id
    //console.log("3");
    //console.log("id:",reviewId);
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        new ApiError(400, "Invalid review ID")
    }
    
    ///console.log("cursor:",cursor)
    const query= cursor && mongoose.Types.ObjectId.isValid(cursor)
            ? {_id:{$lt: new mongoose.Types.ObjectId(cursor)}}
            : {}
    //console.log("Query:",query);
    
    const  comments= await Comment.aggregate([
        {$match:{review: new mongoose.Types.ObjectId(reviewId), ...query}},
        {$sort:{createdAt: -1}},
        {$limit: Number(limit)},
        {$lookup:{
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner"
        }},
        {$unwind: "$owner"}
    ])
    //console.log("comments:",comments);
    
    const nextCursor= comments.length>0? comments[comments.length-1]._id:null 
    return res
    .status(200)
    .json(new ApiResponse(200,{comments: comments, nextCursor},"comments fetched successfully"))
})

const addAComment= asynchandler(async (req,res) => {
    const id= req.params.Id
    const userId= req.user._id
    if(!userId){
        throw new ApiError(404,"Unautharised user")
    }
    const {content}= req.body
    if(!id || !mongoose.Types.ObjectId.isValid(id)){ //isValid will check if its a 24 char string or not if yes return true else false
        throw new ApiError(400,"id recived is not valid")
    }
    const reviewId= new mongoose.Types.ObjectId(id) //this will throw error if id is somthing other that 12 byte/ 24 character string, so for this we need to check if its valid or not.
    const commentDocument= await Comment.create({
        owner: userId,
        review: id,
        content: content
    })
    await User.findByIdAndDelete(userId,{comments: commentDocument._id})
    const reviewDocument= await Review.findByIdAndUpdate(
        reviewId,
        {$push:{comments: commentDocument._id}}
    )
    //console.log("review:",reviewDocument);
    
    return res
    .status(200)
    .json(new ApiResponse(200,{review: reviewDocument, comment: commentDocument},"Comment added successfully"))
})

const deleteAComment= asynchandler(async (req,res) => {
    //console.log("1");
    
    const commentid= req.params.Id
    const userId= req.user._id
    
    if(!userId){
        throw new ApiError(404,"Unautharised user")
    }
    if(!commentid || !mongoose.Types.ObjectId.isValid(id)){ //isValid will check if its a 24 char string or not if yes return true else false
        throw new ApiError(400,"id recived is not valid")
    }
    const commentId= new mongoose.Types.ObjectId(commentid) //this will throw error if id is somthing other that 12 byte/ 24 character string, so for this we need to check if its valid or not.
    const commentDocument= await Comment.findOneAndDelete({
        _id: commentId, owner: userId
    })
    //console.log(commentDocument);
    
    const reviewDocument= await Review.findOneAndUpdate(
        {owner: userId, comments: commentDocument._id},
        {$pull:{comments: commentDocument._id}},
        {new: true}
    )
    //console.log("4");
    
    return res
    .status(200)
    .json(new ApiResponse(200,{review: reviewDocument, comment: commentDocument},"Comment added successfully"))
})
const getNewestComment= asynchandler(async (req,res) => {
    //console.log("1");
    
    const userId= req.user._id
    //console.log("2");

    const reviewid= req.params.Id
    //console.log("reviewId:",reviewid);
    
    if(!userId){
        throw new ApiError(404,"Unautharised user")
    }
    if(!reviewid || !mongoose.Types.ObjectId.isValid(reviewid)){
        throw new ApiError(400,"id recived is not valid")
    }
    const reviewId= new mongoose.Types.ObjectId(reviewid)
    const commentDocument= await Comment.find({owner: userId, review: reviewId}).sort({createdAt:-1}).limit(1).populate("owner")
    return res
    .status(200)
    .json(new ApiResponse(200,{comment: commentDocument},"Comment fetched successfully"))
})

export {
    createReview,
    editReview,
    deleteReview,
    getUserReview,
    getAllcomments,
    deleteAComment,
    addAComment,
    getNewestComment,
}