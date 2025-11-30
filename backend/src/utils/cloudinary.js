import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const uploadOnCloudinary= async (LocalFilePath)=>{
    try {
        if(!LocalFilePath){
            return null
        }
        const uploadResult=await cloudinary.uploader.upload(LocalFilePath,{resourse_type: auto})
        return uploadResult
    } catch (error) {
        fs.unlinkSync(LocalFilePath)
        return null
    }
}

export { uploadOnCloudinary }