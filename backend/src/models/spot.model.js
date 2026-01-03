import mongoose,{Schema} from "mongoose"

const spotSchema= Schema({
    spotName:{
        type: String,
        lowercase: true,
        required: true,
        trim: true
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    latitude:{
        type: Number,
        set: val => {
            const num = Number(val);
            if (Number.isNaN(num)) return undefined;
            return Number(num.toFixed(3));
        }
    },
    longitude:{
        type: Number,
        set: val => {
            const num = Number(val);
            if (Number.isNaN(num)) return undefined;
            return Number(num.toFixed(3));
        }
    },
    likes:{
        type: Number
    }
})

export const Spot= mongoose.model("Spot",spotSchema)