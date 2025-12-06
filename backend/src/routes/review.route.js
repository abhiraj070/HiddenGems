import { Router } from "express";
import { createReview, deleteReview, editReview, getUserReview } from "../controllers/review.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
const router=Router()

router.route("/createReview").post(verifyJWT,createReview)
router.route("/edit/review/:id").post(editReview)
router.route("/delete/review/:id").post(deleteReview)
router.route("/get/user/:id/").get(getUserReview)

export default router