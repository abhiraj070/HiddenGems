import mongoose ,{ Schema } from "mongoose";
import JWT from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userschema = Schema({
    fullname:{
        type: String,
        required: true,
        trim: true
    },
    bio:{
        type: String,
    },
    followers:[{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    following:[{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    profilepicture:{
        type: String,
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        index: true
    },
    password:{
        type: String,
        required: function () {
            return !this.googleId
        }
    },
    refreshToken:{
        type: String,
    },
    googleId:{
        type: String
    },
    reviewHistory:[{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    savedPlaces:[{
        type: Schema.Types.ObjectId,
        ref: "Spot"
    }],
    favourite:[{
        type: Schema.Types.ObjectId,
        ref: "Spot"
    }],
    likedReviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
},{timestamps: true})

userschema.index(
    {_id:1, savedPlaces:1}
)
userschema.index(
    {_id:1, favourite:1}
)
userschema.index(
    {_id:1, following:1}
)

userschema.pre("save", async function() { // next() is not required in aysnc function in moongoose middleware
    if (!this.isModified("password")) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userschema.methods.isPasswordCorrect=async function (password) {
    console.log("User.isPasswordCorrect: Comparing password");
    const result = await bcrypt.compare(password,this.password)
    console.log("User.isPasswordCorrect: Password match:", result);
    return result
}

userschema.methods.generateAccessToken = function() {
    console.log("User.generateAccessToken: Generating access token");
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
    console.log("User.generateRefreshToken: Generating refresh token");
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