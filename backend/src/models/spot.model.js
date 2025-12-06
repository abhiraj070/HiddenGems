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
    }]
    // lat:
    // long:
})

export const Spot= mongoose.model("Spot",spotSchema)