import { Follow } from "../models/follow.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asynchandler } from "../utils/asynchandler.js"

const isFollowing=asynchandler(async (req,res) => {
    const user_id= req.params.id
    const curruser_id= req.user._id
    const isSame= !(user_id==curruser_id)
    if(!user_id){
        throw new ApiError(404,"Secondary user not found")
    }
    const followingdocument= await Follow.exists({
        targetId: user_id,
        followerId: curruser_id
    }).lean()
    const result= Boolean(followingdocument)    
    //console.log("followers2: ",user.followers);
    return res
    .status(200)
    .json(new ApiResponse(200,{isFollowing: result, isSame: isSame},"User's following confirmed successfully"))
})

export {isFollowing}