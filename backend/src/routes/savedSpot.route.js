import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteSavedPlaceById, toggelSaveSpot } from "../controllers/savedSpot.controller.js";

const router= Router()

router.route("/toggleSave/:lat/:lng").post(verifyJWT,toggelSaveSpot)
router.route("/delete/saved/:id").post(verifyJWT,deleteSavedPlaceById)

export default router