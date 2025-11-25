import mongoose, {Schema} from 'mongoose'

const spotSchema= Schema({
    owner:{
        type: Schema.Types.ObjectId,
        ref: Owner
    },
    content:{
        type: String,
        required: true
    },
    tag:{
        type: String,
        required: true
    }
    
})

export const Spot= mongoose.model("Spot",spotSchema)