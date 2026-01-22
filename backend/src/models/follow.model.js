import mongoose,{Schema} from "mongoose"

const followSchema= Schema({
    followerId:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    targetId:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true})
followSchema.index(
    {followerId: 1, targetId: 1},
    {unique: true}
)
export const Follow= mongoose.model("Follow", followSchema)