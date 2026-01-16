import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleLike, getAllLikedSpots } from "../controllers/like.controller.js";

const router= Router()

router.route("/toggleLike/:lat/:lng/:type").post(verifyJWT,toggleLike)
router.route("/getlikedSpots").get(verifyJWT,getAllLikedSpots)

export default router