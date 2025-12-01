import { Router } from "express";
import { registerUser, loginUser, logout } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router()

router.route("/register").post(
    upload.single("profilepicture"),
    registerUser
)
router.route("/login").post(verifyJWT,loginUser)
router.route("/logout").post(logout)



export default router