import { registerUser, loginUser, logout } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router=Router()

router.route("/register").post(registerUser)
router.route("/login").post(verifyJWT,loginUser)
router.route("/logout").post(logout)



export default router