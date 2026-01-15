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
//this is compound indexing, i took 3 fields and created an index, index like ({id1,id2,id3}->idlike), till here only searching is getting faster. after this when we add unique: true, this gareenties me that no other document with same field values will be created
export const Like= mongoose.model("Like", LikeSchema)
//additional info about compound indexing speed: we get the speed advantage only if either all the fields in the index are present while searching or if we are unsing only first field it should be the leftmost ortherwise no speed advantage