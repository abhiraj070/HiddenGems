import mongoose,{ Schema } from "mongoose"

const commentSchema= Schema({
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    review:{
        type: Schema.Types.ObjectId,
        ref: "Review"
    },
    content:{
        type: String
    }
},{timestamps: true})

commentSchema.index(
    {owner: 1, review:1},
)

export const Comment= mongoose.model("Comment",commentSchema)