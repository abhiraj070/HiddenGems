import mongoose ,{ Schema } from "mongoose";

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
    Email:{
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
    reviewHistory:{
        type: [Schema.Types.ObjectId],
        ref: Spot
    },
    savedPlaces:{
        type: [Schema.Types.ObjectId],
        ref: Spot
    },
    favourite:{
        type: [Schema.Types.ObjectId],
        ref: Spot
    }
},{Timestamps: true})


export const User= mongoose.model("User",userschema)