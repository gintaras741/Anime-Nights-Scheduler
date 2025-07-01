import { Request, Response } from "express";
import { UserInstance } from "../services/authService";

export const verifyKey = async (req: Request, res: Response) => {
    const key = req.headers["key"] as string;

    if (!key) {
        res.status(401).json({ message: "Access key is required" });
        return;
    }

    try {
        const user = await UserInstance.findOne({
            where: { key },
            attributes: ["id", "role"],
        });

        if (!user) {
            res.status(401).json({ message: "Invalid access key" });
            return;
        }

        res.json(user.get({ plain: true }));
    } catch (error: any) {
        console.error("Error verifying access key:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
