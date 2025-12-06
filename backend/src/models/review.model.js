import mongoose, {Schema} from 'mongoose'

const reviewSchema= Schema({
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    spotName:{
        type: String,
        lowercase:true,
        required: true,
        trim: true
    },
    content:{
        type: String,
        required: true
    },
    tag:{
        type: String,
        required: true
    }
    
})

export const Review= mongoose.model("Review",reviewSchema)