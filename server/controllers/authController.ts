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

export const createUser = async (req: Request, res: Response) => {
    const { stagename, key } = req.body;
    try {
        const user = await UserInstance.create({
            key: key,
            role: "user",
            cosplayer_fk: stagename,
        });
        res.status(201).json({ user });
    } catch (error: any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { key } = req.body;
    try {
        const { stagename } = req.params;
        const user = await UserInstance.findOne({
            where: { cosplayer_fk: stagename },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        user.set({
            key: key,
        });
        await user.save();
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error: any) {
        console.error("Error updating user:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const isValidKey = async (req: Request, res: Response) => {
    const key = req.body.key;
    try {
        const foundKey = await UserInstance.findOne({
            where: { key },
        });
        if (foundKey) {
            res.status(409).json({ message: "Key already exists" });
            return;
        } else {
            res.status(200).json({ message: "Key is valid", key });
        }
    } catch (error: any) {
        console.error("Error checking key:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
