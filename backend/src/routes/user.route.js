import { Router } from "express";
import { registerUser, loginUser, logout, updateName,
    changePhoto, refreshAccessToken, changePassword, getUserDetails, googleSignIn, 
    deleteReview, addBio, checkIsLikedSaved, getanotherUserDetails,
    isFollowing, addAFollowerFollowing, removeAFollowerFollowing } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router()

router.route("/register").post(
    upload.single("profilepicture"),
    registerUser
)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logout)
router.route("/updatePhoto").post(
    verifyJWT,
    upload.single("profilepicture"),
    changePhoto
)
router.route("/refreshtoken").post(refreshAccessToken)
router.route("/changePassword").post(verifyJWT,changePassword)
router.route("/get/user").get(verifyJWT,getUserDetails)
router.route("/delete/review/:id").post(verifyJWT,deleteReview)
router.route("/addbio").post(verifyJWT,addBio)
router.route("/check/:lat/:lng").get(verifyJWT,checkIsLikedSaved)
router.route("/get/user/:Id").get(getanotherUserDetails)
router.route("/get/check/:id").get(verifyJWT,isFollowing)
router.route("/follow/user/:id").post(verifyJWT,addAFollowerFollowing)
router.route("/unfollow/user/:id").post(verifyJWT,removeAFollowerFollowing)
router.route("/edit/name").post(verifyJWT,updateName)
router.route("/google-login").post(googleSignIn)
export default router