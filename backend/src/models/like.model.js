import mongoose,{Schema} from "mongoose";

const LikeSchema= Schema({
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    targetId: {
        type: Schema.Types.ObjectId,
        refPath: "targetType", //here refPath is used when we need ref dynamically.
        required: true
    },
    targetType: {
        type: String,
        enum: ["Spot","Review"],
        required: true
    }
})
// if i would have used Unique: true here, that would create a problem that, a user can only have one liked document.
// to solve this problem we use compound index:

LikeSchema.index(
    {likedBy:1, targetId:1, targetType:1},
    {unique: true}
)

export const Like= mongoose.model("Like", LikeSchema)