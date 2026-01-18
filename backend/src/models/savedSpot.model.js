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

SavedSpot.index(
    {savedBy:1, targetId:1},
    {unique: true}
)

export const SavedSpot= mongoose.model("SavedSpot", savedSpotsSchema)