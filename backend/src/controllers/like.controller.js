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
    const {type, id}= req.params
    //console.log("user: ",user_id);
    if(!user_id){
        throw new ApiError(404, "Unathorized request")
    }
    if(!type){
        throw new ApiError(400,"missing required parameters")
    }
    let target
    if(type==="Spot"){
        target= await Spot.findOne({latitude: lat, longitude: lng}).lean()// lean is used for optimisation. it skips the step where mongoose wrapper is wrapped on the returned value. that wrapper helps use to use .save. so a palin JS object is returned instead of mongoose document
    }
    else{
        target= await Review.findById(id).lean()
    }
    if(!target){
        throw ApiError(400,"No spot/Review created on recived coordinates")
    }
    //console.log("target: ",target);
    const target_id= target._id
    //console.log("type: ",type);
    
    if(!mongoose.Types.ObjectId.isValid(target_id)){
        throw new ApiError(402, "invalid parameter")
    }
    const isPresent= await Like.findOneAndDelete({likedBy:user_id, targetId: target_id, targetType: type})
    let userdocument, spotDocumnet, reviewDocument
    //console.log("id: ",user_id);
    
    if(!isPresent){
        
        try {
            await Like.create({
                likedBy: user_id,
                targetId: target_id,
                targetType: type
            })
        } catch (error) {// i am doing this to handle the case where user hit the like button multiple times to generate unlike/like reqs. 
        // imagine 3 unlike req almost same time par generate hui, ek ne deakha ki koi like document hai toh usse delete kar diya aur baaki 2 
        // ko koi documents nhi mile toh unhe laga like karna hai. phir dono like documment create karne nikal padenge. taaki dono like docs 
        // generate na kar de hum ke duplicate keys wala check laga reh hai. 
            if(error.code==11000){//error code when there is a duplicate ley error.
                return res
                .status(200)
                .json(new ApiResponse(200,{},"review already liked"))
            }
            return new ApiError(500,`${error}`)
        }
        if(type==="Spot"){
            [userdocument, spotDocumnet]= await Promise.all([
                User.findByIdAndUpdate(user_id,{$push:{favourite: target_id}},{new: true}).lean(),
                Spot.findByIdAndUpdate(target_id,{$inc:{likes: 1}},{new: true}).lean()
            ])
        }
        else{
            [userdocument, reviewDocument]= await Promise.all([
                User.findByIdAndUpdate(user_id, {$push:{likedReviews: target_id}},{new: true}).lean(),
                Review.findByIdAndUpdate(target_id, {$inc:{likes: 1}},{new: true}).populate("owner").lean()
            ])
        }
    }
    else{
        if(type==="Spot"){
            [userdocument, spotDocumnet]=await  Promise.all([
                User.findByIdAndUpdate(user_id,{$pull:{favourite: target_id}}, {new: true}).lean(),
                Spot.findByIdAndUpdate(target_id, {$inc:{likes: -1}},{new: true}).lean()
            ])
        }
        else{
            [reviewDocument, userdocument]=await  Promise.all([
                Review.findByIdAndUpdate(target_id, {$inc:{likes:-1}},{new: true}).populate("owner").lean(),
                User.findByIdAndUpdate(user_id,{$pull:{likedReviews: target_id}},{new: true}).lean()
            ])
        }
    }
    return res
        .status(200)
        .json(new ApiResponse(200,{ spot: spotDocumnet, review: reviewDocument},"Like toggled Successfully"))
})

//cursor based pagination with infinite scroll 
const getAllLikedSpots= asynchandler(async (req,res) => {    
    //console.log("1");
    
    const {cursor, limit}= req.query
    const userId= req.user._id
    if(!userId){
        throw ApiError(400,"Unauthorized user")
    }
    const query = 
        cursor && mongoose.Types.ObjectId.isValid(cursor)
            ? { _id: { $lt: new mongoose.Types.ObjectId(cursor) } }
            : {};
    const spots= await Like.aggregate([
        {
            $match:{likedBy: userId, targetType: "Spot", ...query} //match is like find(). i used spread operator here because i want _id:{ $lt:cursor } inside not query: _id:{ $lt:cursor }
        },
        {
            $sort:{createdAt: -1}
        },
        {
            $limit: Number(limit) //from query number comes in a string form
        },
        {
            $lookup:{ //lookup is like populate
                from: "spots",
                localField: "targetId",
                foreignField: "_id",
                as: "spotsLiked" //a new field is added in this step.
            }
        }        
    ])
        //console.log("re:",spots)

    return res
    .status(200)
    .json(new ApiResponse(200,{data: spots, nextCursor: spots.length? spots[spots.length-1]._id: null}))
})

const getNumberOfFavSpots= asynchandler(async (req,res) => {
    const user_id= req.user._id
    //console.log(("USer:",user_id));
    if(!user_id){
        throw ApiError(404,"Unathorized request")
    }
    const likeSpots= await Like.find({likedBy: user_id, targetType: "Spot"}).lean()
    const number= likeSpots.length
    return res
    .status(200)
    .json(new ApiResponse(200,{number: number},"Successfully fetched user's liked spots"))
})



export {toggleLike, getAllLikedSpots, getNumberOfFavSpots}