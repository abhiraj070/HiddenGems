import { Router } from "express";
import { registerUser, loginUser, logout, changeUserDetails, changePhoto, refreshAccessToken, changePassword, saveASpot, favSpot, removeSavedSpot, checkIfSaved, getUserDetails, deleteReview, deleteSavedPlaceById, addBio } from "../controllers/user.controller.js";
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
router.route("/favSpot").post(verifyJWT,favSpot)
router.route("/deletespot/:lat/:lng").post(verifyJWT,removeSavedSpot)
router.route("/check/:lat/:lng").get(verifyJWT,checkIfSaved)
router.route("/get/user").get(verifyJWT,getUserDetails)
router.route("/delete/review/:id").post(verifyJWT,deleteReview)
router.route("/delete/saved/:id").post(verifyJWT,deleteSavedPlaceById)
router.route("/addbio").post(verifyJWT,addBio)
export default router