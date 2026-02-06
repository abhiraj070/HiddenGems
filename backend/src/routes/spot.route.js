import { Router } from "express";
import { getSpotBox, getAllSpots, getSelectedSpot, getSpotsFromQuery } from "../controllers/spot.controller.js";

const router= Router()

router.route("/get/:lat/:lng").get(getSpotBox)
router.route("/get/spots").post(getAllSpots)
router.route("/get/selectedSpot").post(getSelectedSpot)
router.route("/get/querrySpots").post(getSpotsFromQuery)
export default router