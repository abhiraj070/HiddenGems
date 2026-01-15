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
        required: true,
        index: true
    },
    latitude:{
        type: Number,
        set: val => {
            const num = Number(val);
            if (Number.isNaN(num)) return undefined;
            return Number(num.toFixed(3));
        }
    },
    longitude:{
        type: Number,
        set: val => {
            const num = Number(val);
            if (Number.isNaN(num)) return undefined;
            return Number(num.toFixed(3));
        }
    },
    likes:{
        type: Number
    }
})

export const Review= mongoose.model("Review",reviewSchema)