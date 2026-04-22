import { Request, Response } from "express";
import { socket } from "../server";
import { CosplayerInstance } from "../services/index";
import { UserInstance } from "../services/index";
import { col, fn, where } from "sequelize";

const normalizeStagename = (value: string) =>
    value
        .normalize("NFKC")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();

const findCosplayerByStagename = async (rawStagename: string) => {
    const stagename = (rawStagename || "").trim();
    if (!stagename) {
        return null;
    }

    const direct = await CosplayerInstance.findOne({
        where: { stagename },
    });
    if (direct) {
        return direct;
    }

    const caseInsensitive = await CosplayerInstance.findOne({
        where: where(fn("LOWER", col("stagename")), stagename.toLowerCase()),
    });
    if (caseInsensitive) {
        return caseInsensitive;
    }

    const normalizedTarget = normalizeStagename(stagename);
    const candidates = await CosplayerInstance.findAll({
        attributes: ["stagename"],
    });

    const matched = candidates.find((candidate) => {
        const candidateStagename = candidate.get("stagename") as string;
        return normalizeStagename(candidateStagename) === normalizedTarget;
    });

    if (!matched) {
        return null;
    }

    return CosplayerInstance.findOne({
        where: { stagename: matched.get("stagename") as string },
    });
};

export const createCosplayer = async (req: Request, res: Response) => {
    console.log("Cosplayer:", { ...req.body });
    try {
        const cosplayer = await CosplayerInstance.create({ ...req.body });
        socket.emit("cosplayersUpdated");
        res.status(201).json({ cosplayer });
    } catch (error: any) {
        console.error("Error creating user:", error);
        if (error.name === "SequelizeUniqueConstraintError") {
            res.status(409).json({
                message: "Cosplayer with this stagename already exists",
            });
        } else {
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    }
};

export const getCosplayers = async (req: Request, res: Response) => {
    try {
        const cosplayers = await CosplayerInstance.findAll({
            attributes: [
                "stagename",
                "character",
                "cosplayTime",
                "comment",
                "isGlowingCosplay",
                "isCrossedOutCosplay",
            ],
            order: [["cosplayTime", "ASC"]],
        });
        res.status(200).json({ cosplayers });
    } catch (error: any) {
        console.error("Error fetching cosplayers:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const getAllCosplayers = async (req: Request, res: Response) => {
    try {
        const cosplayers = await CosplayerInstance.findAll({
            attributes: [
                "stagename",
                "character",
                "cosplayTime",
                "comment",
                "prejudge",
                "prejudgeTime",
            ],
            order: [["cosplayTime", "ASC"]],
        });
        res.status(200).json({ cosplayers });
    } catch (error: any) {
        console.error("Error fetching all cosplayers:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const getCosplayersUser = async (req: Request, res: Response) => {
    try {
        const cosplayers = await CosplayerInstance.findAll({
            attributes: [
                "stagename",
                "cosplayTime",
                "isGlowingCosplay",
                "isCrossedOutCosplay",
            ],
            order: [["cosplayTime", "ASC"]],
        });
        res.status(200).json({ cosplayers });
    } catch (error: any) {
        console.error("Error fetching all cosplayers for user:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const getCosplayersPrejudge = async (req: Request, res: Response) => {
    try {
        const cosplayers = await CosplayerInstance.findAll({
            attributes: [
                "stagename",
                "character",
                "prejudgeTime",
                "isGlowingPrejudge",
                "isCrossedOutPrejudge",
            ],
            where: {
                prejudge: true,
            },
            order: [["prejudgeTime", "ASC"]],
        });
        res.status(200).json({ cosplayers });
    } catch (error: any) {
        console.error("Error fetching prejudge cosplayers:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const getCosplayersPrejudgeUser = async (
    req: Request,
    res: Response
) => {
    try {
        const cosplayers = await CosplayerInstance.findAll({
            attributes: [
                "stagename",
                "prejudgeTime",
                "isGlowingPrejudge",
                "isCrossedOutPrejudge",
            ],
            where: {
                prejudge: true,
            },
            order: [["prejudgeTime", "ASC"]],
        });
        res.status(200).json({ cosplayers });
    } catch (error: any) {
        console.error("Error fetching prejudge cosplayers for user:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const getCosplayerByName = async (req: Request, res: Response) => {
    try {
        const { stagename } = req.params;
        const cosplayer = await CosplayerInstance.findOne({
            where: { stagename },
        });
        if (!cosplayer) {
            res.status(404).json({ message: "Cosplayer not found" });
            return;
        }
        res.status(200).json({ cosplayer });
    } catch (error: any) {
        console.error("Error fetching cosplayer:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const updateCosplayer = async (req: Request, res: Response) => {
    try {
        const stagename = (req.params.stagename || "").trim();
        if (!stagename) {
            res.status(400).json({ message: "Stagename is required" });
            return;
        }

        const resolvedCosplayer = await findCosplayerByStagename(stagename);

        if (!resolvedCosplayer) {
            res.status(404).json({ message: "Cosplayer not found" });
            return;
        }

        const updatedCosplayer = await resolvedCosplayer.update(req.body);
        socket.emit("cosplayersUpdated");
        res.status(200).json({ updatedCosplayer });
    } catch (error: any) {
        console.error("Error updating cosplayer:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const deleteCosplayer = async (req: Request, res: Response) => {
    try {
        const stagename = (req.params.stagename || req.body?.stagename || "").trim();
        if (!stagename) {
            res.status(400).json({ message: "Stagename is required" });
            return;
        }

        const resolvedCosplayer = await findCosplayerByStagename(stagename);

        if (!resolvedCosplayer) {
            res.status(404).json({ message: "Cosplayer not found" });
            return;
        }

        await resolvedCosplayer.destroy();
        socket.emit("cosplayersUpdated");
        res.status(200).json({ message: "Cosplayer deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting cosplayer:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const toggleCosplayGlow = async (stagename: string) => {
    try {
        const cosplayer = await CosplayerInstance.findOne({
            where: { stagename },
        });
        if (!cosplayer) {
            console.error("Cosplayer not found for toggling glow: ", stagename);
            return;
        }
        cosplayer.set("isGlowingCosplay", !cosplayer.get("isGlowingCosplay"));
        await cosplayer.save();
        socket.emit("cosplayersUpdated");
    } catch (error: any) {
        console.error("Error toggling cosplay glow:", error);
    }
};

export const toggleCosplayCrossedOut = async (stagename: string) => {
    try {
        const cosplayer = await CosplayerInstance.findOne({
            where: { stagename },
        });
        if (!cosplayer) {
            console.error("Cosplayer not found for crossing out: ", stagename);
            return;
        }
        cosplayer.set(
            "isCrossedOutCosplay",
            !cosplayer.get("isCrossedOutCosplay")
        );
        await cosplayer.save();
        socket.emit("cosplayersUpdated");
    } catch (error: any) {
        console.error("Error toggling cosplay crossed out:", error);
    }
};

export const togglePrejudgeCrossedOut = async (stagename: string) => {
    try {
        const cosplayer = await CosplayerInstance.findOne({
            where: { stagename },
        });
        if (!cosplayer) {
            console.error(
                "Cosplayer not found for crossing out (prejudge): ",
                stagename
            );
            return;
        }
        cosplayer.set(
            "isCrossedOutPrejudge",
            !cosplayer.get("isCrossedOutPrejudge")
        );
        await cosplayer.save();
        socket.emit("cosplayersUpdated");
    } catch (error: any) {
        console.error("Error toggling cosplay crossed out (prejudge):", error);
    }
};

export const togglePrejudgeGlow = async (stagename: string) => {
    try {
        const cosplayer = await CosplayerInstance.findOne({
            where: { stagename },
        });
        if (!cosplayer) {
            console.error(
                "Cosplayer not found for toggling glow (prejudge): ",
                stagename
            );
            return;
        }
        cosplayer.set("isGlowingPrejudge", !cosplayer.get("isGlowingPrejudge"));
        await cosplayer.save();
        socket.emit("cosplayersUpdated");
    } catch (error: any) {
        console.error("Error toggling cosplay glow (prejudge):", error);
    }
};

export const getProfileData = async (req: Request, res: Response) => {
    try {
        console.log(req.user?.key);
        const user = await UserInstance.findOne({
            where: { key: req.user?.key },
            attributes: [],
            include: [
                {
                    model: CosplayerInstance,
                    as: "cosplayer",
                    required: true,
                    attributes: [
                        "stagename",
                        "character",
                        "cosplayTime",
                        "prejudge",
                        "prejudgeTime",
                        "comment",
                        "cosplayAudio",
                        "cosplayVideo",
                    ],
                },
            ],
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error: any) {
        console.error("Error fetching profile data:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
