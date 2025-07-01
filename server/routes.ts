import express from "express";
import {
    createCosplayer,
    deleteCosplayer,
    getCosplayerByName,
    getCosplayers,
    updateCosplayer,
    getCosplayersPrejudge,
    getAllCosplayers,
    getCosplayersUser,
    getCosplayersPrejudgeUser,
    getProfileData,
} from "./controllers/cosplayerController";
import { verifyKey } from "./controllers/authController";
import {
    authenticateKey,
    authorizeAdmin,
    authorizeRoles,
    authorizeUser,
} from "./middleware/auth";
import limiter from "./middleware/rateLimit";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({ message: "Hello from the API!" });
});

router.get("/cosplayers", authenticateKey, authorizeAdmin, getCosplayers);
router.get(
    "/cosplayers/all",
    authenticateKey,
    authorizeAdmin,
    getAllCosplayers
);
router.get(
    "/cosplayers/prejudge",
    authenticateKey,
    authorizeAdmin,
    getCosplayersPrejudge
);
router.get(
    "/cosplayers/user",
    authenticateKey,
    authorizeUser,
    getCosplayersUser
);
router.get(
    "/cosplayers/prejudge/user",
    authenticateKey,
    authorizeUser,
    getCosplayersPrejudgeUser
);
router.get(
    "/cosplayers/:stagename",
    authenticateKey,
    authorizeAdmin,
    getCosplayerByName
);
router.post("/cosplayers", authenticateKey, authorizeAdmin, createCosplayer);
router.put(
    "/cosplayers/:stagename",
    authenticateKey,
    authorizeAdmin,
    updateCosplayer
);
router.delete(
    "/cosplayers/:stagename",
    authenticateKey,
    authorizeAdmin,
    deleteCosplayer
);
router.get("/profile", authenticateKey, getProfileData);
router.post("/verifyKey", verifyKey);

export default router;
