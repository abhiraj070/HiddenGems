import mongoose,{ Schema } from "mongoose"

const commentSchema= Schema({
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    spot:{
        type: Schema.Types.ObjectId,
        ref: "Spot"
    },
    content:{
        type: String
    }
},{timestamps: true})

export const Comment= mongoose.model("Comment",commentSchema)