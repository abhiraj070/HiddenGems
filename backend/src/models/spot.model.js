import mongoose,{Schema} from "mongoose"

const spotSchema= Schema({
    spotName:{
        type: String.toLowerCase(),
        required: true,
        trim: true
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
})

export const Spot= mongoose.model("Spot",spotSchema)