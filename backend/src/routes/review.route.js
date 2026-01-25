import { Router } from "express";
import { addAComment, createReview, deleteAComment, deleteReview, editReview, getAllcomments, getNewestComment, getUserReview } from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router()

router.route("/createReview").post(verifyJWT,createReview)
router.route("/edit/review/:id").post(editReview)
router.route("/delete/review/:id").post(deleteReview)
router.route("/get/user/:id/").get(getUserReview)
router.route("/get/comments/:Id").get(getAllcomments)
router.route("/add/comment/:Id").post(verifyJWT,addAComment)
router.route("/delete/comment/:Id").post(verifyJWT, deleteAComment)
router.route("/get/newcomment/:Id").get(verifyJWT,getNewestComment)
export default router