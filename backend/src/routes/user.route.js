import { Router } from "express";
import { registerUser, loginUser, logout, changeUserDetails, 
    changePhoto, refreshAccessToken, changePassword, saveASpot, 
    favSpot, removeSavedSpot, checkIfSaved, getUserDetails, 
    deleteReview, deleteSavedPlaceById, addBio, checkIsLiked,
    removefavspot, getUserFavSpots, getanotherUserDetails,
    getFollowers, addAFollowerFollowing, removeAFollowerFollowing } from "../controllers/user.controller.js";
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
router.route("/changePassword").post(verifyJWT,changePassword)
router.route("/saveSpot/:lat/:lng").post(verifyJWT,saveASpot)
router.route("/favSpot/:lat/:lng").post(verifyJWT,favSpot)
router.route("/deletespot/:lat/:lng").post(verifyJWT,removeSavedSpot)
router.route("/check/:lat/:lng").get(verifyJWT,checkIfSaved)
router.route("/get/user").get(verifyJWT,getUserDetails)
router.route("/delete/review/:id").post(verifyJWT,deleteReview)
router.route("/delete/saved/:id").post(verifyJWT,deleteSavedPlaceById)
router.route("/addbio").post(verifyJWT,addBio)
router.route("/check/liked/:lat/:lng").get(verifyJWT,checkIsLiked)
router.route("/removeliked/:lat/:lng").post(verifyJWT,removefavspot)
router.route("/get/likes").get(verifyJWT,getUserFavSpots)
router.route("/get/user/:Id").get(getanotherUserDetails)
router.route("/get/user/follower/:id").get(verifyJWT,getFollowers)
router.route("/follow/user/:id").post(verifyJWT,addAFollowerFollowing)
router.route("/unfollow/user/:id").post(verifyJWT,removeAFollowerFollowing)
export default router