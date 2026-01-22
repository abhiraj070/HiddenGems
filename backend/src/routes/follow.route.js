import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isFollowing } from "../controllers/follow.controller.js";

const router= Router()

router.route("/get/check/:id").get(verifyJWT,isFollowing)


export default router