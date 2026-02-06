import { Router } from "express";
import { getSpotBox, getAllSpots, getSelectedSpot } from "../controllers/spot.controller.js";

const router= Router()

router.route("/get/:lat/:lng").get(getSpotBox)
router.route("/get/spots").post(getAllSpots)
router.route("/get/selectedSpot").post(getSelectedSpot)
export default router