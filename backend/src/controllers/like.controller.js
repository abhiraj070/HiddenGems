import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import { Like } from "../models/like.model.js";
import { Spot } from "../models/spot.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/review.model.js";

const toggleLike= asynchandler(async (req,res) => {
    const user_id= req.user._id
    const {lat, lng}= req.params
    const {type}= req.params
    //console.log("user: ",user_id);
    if(!user_id){
        throw new ApiError(404, "Unathorized request")
    }
    if(!type){
        throw new ApiError(400,"missing required parameters")
    }
    const model= type==="Spot"? Spot: Review
    const target= await model.findOne({latitude: lat, longitude: lng})
    if(!target){
        throw ApiError(400,"No spot created on recived coordinates")
    }
    //console.log("target: ",target);
    const target_id= target._id
    //console.log("type: ",type);
    
    if(!mongoose.Types.ObjectId.isValid(target_id)){
        throw new ApiError(402, "invalid parameter")
    }
    const isPresent= await Like.findOne({likedBy:user_id, targetId: target_id, targetType: type})
    let userdocument, spotDocumnet, reviewDocument
    //console.log("id: ",user_id);
    
    if(!isPresent){
        await Like.create({
            likedBy: user_id,
            targetId: target_id,
            targetType: type
        })
        if(type==="Spot"){
            userdocument= await User.findByIdAndUpdate(user_id,{$push:{favourite: target_id}},{new: true}).populate("favourite")
            spotDocumnet= await Spot.findByIdAndUpdate(target_id,{$inc:{likes: 1}},{new: true})
            console.log("spot: ",spotDocumnet);
            
        }
        else{
            userdocument= await User.findByIdAndUpdate(user_id, {$push:{likedReviews: target_id}},{new: true}).populate("likedReviews")
            reviewDocument= await Review.findByIdAndUpdate(target_id, {$inc:{likes: 1}},{new: true})
        }
    }
    else{
        await Like.findOneAndDelete({likedBy: user_id, targetId: target_id, targetType: type})    
        if(type==="Spot"){
            spotDocumnet= await Spot.findByIdAndUpdate(target_id, {$inc:{likes: -1}},{new: true})
            userdocument= await User.findByIdAndUpdate(user_id,{$pull:{favourite: target_id}}, {new: true}).populate("favourite")
        }
        else{
            reviewDocument= await Review.findByIdAndUpdate(target_id, {$inc:{likes:-1}},{new: true})
            userdocument= await User.findByIdAndUpdate(user_id,{$pull:{likedReviews: target_id}},{new: true}).populate("likedReviews")
        }
    }

    return res
        .status(200)
        .json(new ApiResponse(200,{user: userdocument, spot: spotDocumnet, review: reviewDocument},"Like toggled Successfully"))
})

export {toggleLike}