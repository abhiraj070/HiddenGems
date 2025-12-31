import { Router } from "express";
import { getSpotBox } from "../controllers/spot.controller.js";

const router= Router()

router.route("/get/:lat/:lng").get(getSpotBox)

export default router