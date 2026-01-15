import mongoose,{Schema} from "mongoose";

const LikeSchema= Schema({
    LikedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    likedId: {
        type: Schema.Types.ObjectId,
        refPath: "likedType", //here refPath is used when we need ref dynamically.
        required: true
    },
    likedType: {
        type: String,
        enum: ["Spot","Review"],
        required: true
    }
})
// if i would have used Unique: true here, that would create a problem that, a user can only have one liked document.
// to solve this problem we use compound index:

LikeSchema.index(
    {LikedBy:1, likedId:1, likedType:1},
    {unique: true}
)

export const Like= mongoose.model("Like", LikeSchema)