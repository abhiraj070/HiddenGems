import mongoose,{Schema} from "mongoose"

const spotSchema= Schema({
    spotName:{
        type: String,
        lowercase: true,
        required: true,
        trim: true
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    latitude:{
        type: Number,
        set: val => Number(val.toFixed(3))
    },
    longitude:{
        type: Number,
        set: val => Number(val.toFixed(3))
    }
})

export const Spot= mongoose.model("Spot",spotSchema)