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

userschema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next()
    }
    this.password=await bcrypt.hash(this.password,10)
    next()
})








export const User= mongoose.model("User",userschema)