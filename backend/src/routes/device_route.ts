import { Router } from "express";
import {saveDevice,
    getAllDevices,
    getOneDevice,
    updateDevicePartially,
    upDateDevice,
    deleteDevice} from "../controllers/device_controller";

const router = Router();

router.post("/devices", saveDevice);
router.get("/get-all-devices", getAllDevices);
router.get("/get-single-device/:deviceId", getOneDevice);
router.put("/update-device/:deviceId", upDateDevice);
router.delete("/delete-device/:deviceId", deleteDevice);
router.patch("/updatePartially/:deviceId/state", updateDevicePartially);

export default router;
