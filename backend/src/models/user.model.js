import mongoose ,{ Schema } from "mongoose";
import JWT from 'jsonwebtoken'


const userschema= Schema({
    fullname:{
        type: String,
        required: true,
        trim: true
    },
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    profilepicture:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true
    },
    refreshToken:{
        type: String,
    },
    // reviewHistory:{
    //     type: [Schema.Types.ObjectId],
    //     ref: Spot
    // },
    // savedPlaces:{
    //     type: [Schema.Types.ObjectId],
    //     ref: Spot
    // },
    // favourite:{
    //     type: [Schema.Types.ObjectId],
    //     ref: Spot
    // }
},{Timestamps: true})

userschema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next()
    }
    this.password=await bcrypt.hash(this.password,10)
    next()
})

userschema.method.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password)
}

userschema.method.generateAccessToken= async function(){
    JWT.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userschema.method.generateRefreshToken=async function(){
    JWT.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}




export const User= mongoose.model("User",userschema)