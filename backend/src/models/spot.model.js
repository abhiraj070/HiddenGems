import mongoose,{Schema} from "mongoose"

const spotSchema= Schema({
    spotName:{
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        index: true
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review",
        index: true
    }],
    latitude:{
        type: Number,
        set: val => {
            const num = Number(val)
            if (Number.isNaN(num)) return undefined
            return Number(num.toFixed(6));
        }
    },
    longitude:{
        type: Number,
        set: val => {
            const num = Number(val);
            if (Number.isNaN(num)) return undefined;
            return Number(num.toFixed(6));
        }
    },
    likes:{
        type: Number
    }
})

spotSchema.index(
    {latitude: 1, longitude:1},
    {unique: true}
)

export const Spot= mongoose.model("Spot",spotSchema)