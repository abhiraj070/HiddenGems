import mongoose ,{ Schema } from "mongoose";
import JWT from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userschema = Schema({
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

userschema.pre("save", async function() {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userschema.method.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password)
}

userschema.methods.generateAccessToken = function() {
    return JWT.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userschema.methods.generateRefreshToken = function() {
    return JWT.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}




export const User= mongoose.model("User",userschema)