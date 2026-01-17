import { Router } from "express";
import { registerUser, loginUser, logout, updateName,
    changePhoto, refreshAccessToken, changePassword, saveASpot, removeSavedSpot, getUserDetails, googleSignIn, 
    deleteReview, deleteSavedPlaceById, addBio, checkIsLikedSaved, getNumberOfFavSpots, getanotherUserDetails,
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
router.route("/saveSpot/:lat/:lng").post(verifyJWT,saveASpot)
router.route("/deletespot/:lat/:lng").post(verifyJWT,removeSavedSpot)
router.route("/get/user").get(verifyJWT,getUserDetails)
router.route("/delete/review/:id").post(verifyJWT,deleteReview)
router.route("/delete/saved/:id").post(verifyJWT,deleteSavedPlaceById)
router.route("/addbio").post(verifyJWT,addBio)
router.route("/check/:lat/:lng").get(verifyJWT,checkIsLikedSaved)
router.route("/get/likes").get(verifyJWT,getNumberOfFavSpots)
router.route("/get/user/:Id").get(getanotherUserDetails)
router.route("/get/check/:id").get(verifyJWT,isFollowing)
router.route("/follow/user/:id").post(verifyJWT,addAFollowerFollowing)
router.route("/unfollow/user/:id").post(verifyJWT,removeAFollowerFollowing)
router.route("/edit/name").post(verifyJWT,updateName)
router.route("/google-login").post(googleSignIn)
export default router