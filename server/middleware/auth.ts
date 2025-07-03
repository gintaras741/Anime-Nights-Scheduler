import { Request, Response, NextFunction } from "express";
import db from "../database";
import { UserInstance } from "../services/authService";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id?: number;
                key: string;
                role: string;
                cosplayer_fk?: string | null;
            };
        }
    }
}

export const authenticateKey = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const key = req.headers["key"] as string;

    if (!key) {
        res.status(401).json({ message: "Access key is required" });
        return;
    }

    try {
        const user = await UserInstance.findOne({ where: { key } });

        if (!user) {
            res.status(401).json({ message: "Invalid access key" });
            return;
        }

        req.user = user.get({ plain: true });
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};

export const authorizeAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log("Authorization middleware triggered");
    if (!req.user || req.user.role !== "admin") {
        res.status(403).json({ message: "Forbidden: Admin access required" });
        return;
    }
    next();
};

export const authorizeUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log("Authorization middleware triggered");
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "user")) {
        res.status(403).json({ message: "Forbidden: User access required" });
        return;
    }
    next();
};

export const authorizeRoles = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                message: "Forbidden: Insufficient permissions",
            });
            return;
        }
        next();
    };
};
