import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleLike, getAllLikedSpots, getNumberOfFavSpots } from "../controllers/like.controller.js";

const router= Router()

router.route("/toggleLike/:lat/:lng/:id/:type").post(verifyJWT,toggleLike)
router.route("/getlikedSpots").get(verifyJWT,getAllLikedSpots)
router.route("/get/likes").get(verifyJWT,getNumberOfFavSpots)

export default router