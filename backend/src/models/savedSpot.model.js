import mongoose,{Schema} from "mongoose";

const savedSpotsSchema= Schema({
    savedBy:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    targetId:{
        type: Schema.Types.ObjectId,
        ref: "Spot"
    }
},{timestamps: true})

export const SavedSpot= mongoose.model("SavedSpot", savedSpotsSchema)