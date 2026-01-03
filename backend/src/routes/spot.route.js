import { Router } from "express";
import { getSpotBox, getAllSpots } from "../controllers/spot.controller.js";

const router= Router()

router.route("/get/:lat/:lng").get(getSpotBox)
router.route("/get/spots").get(getAllSpots)
export default router