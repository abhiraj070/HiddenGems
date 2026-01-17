import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteSavedPlaceById, removeSavedSpot, saveASpot } from "../controllers/savedSpot.controller.js";

const router= Router()

router.route("/saveSpot/:lat/:lng").post(verifyJWT,saveASpot)
router.route("/delete/saved/:id").post(verifyJWT,deleteSavedPlaceById)
router.route("/deletespot/:lat/:lng").post(verifyJWT,removeSavedSpot)


export default router