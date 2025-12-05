import { Router } from "express";
import { registerUser, loginUser, logout, changeUserDetails, changePhoto, refreshAccessToken } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router()

router.route("/register").post(
    upload.single("profilepicture"),
    registerUser
)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logout)
router.route("/updateDetails").post(verifyJWT,changeUserDetails)
router.route("/updatePhoto").post(
    verifyJWT,
    upload.single("profilepicture"),
    changePhoto
)
router.route("/refreshtoken").post(refreshAccessToken)

export default router