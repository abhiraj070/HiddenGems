import { User } from "../models/user.model"
import { ApiError } from "../utils/ApiError"

const registerUser= async (req,res)=>{
    const  {fullname, username, password, email}= req.body
    if(!fullname || !username || !email){
        throw new ApiError(400,"FullName, Username and Email are required")
    }
    if(!password ){
        throw new ApiError(400,"Password is required")
    }

    




    const user= User.create({
        fullname,
        email,
        username,
        password
    })



}