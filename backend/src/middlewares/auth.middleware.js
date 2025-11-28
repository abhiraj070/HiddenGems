import { User } from '../models/user.model'
import { ApiError } from '../utils/ApiError'
import asynchandler from '../utils/asynchandler'
import JWT from 'jsonwebtoken'

const verifyJWT=asynchandler (async ()=>{
    const accessToken=req.cookies?.accessToken

    if(!accessToken){
        throw new ApiError(400,"Unauthorized request")
    }

    const decodeToken= JWT.verify(accessToken,process.env.ACCESS_TOKEN_SECRET) 

    const user= User.findByID(decodeToken?._id).select(
        "-password -refreshTOken"
    )
    if(!user){
        throw new ApiError(400,"Unauthorized request")
    }

    req.user=user
    return next()
})

export {verifyJWT}