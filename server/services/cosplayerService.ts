import db from "../database";
import { DataTypes, Model } from "sequelize";
import { UserInstance } from "./authService";

interface CosplayerAttributes {
    stagename: string;
    character: string;
    prejudge: boolean;
    prejudgeTime?: Date;
    cosplayTime: Date;
    comment?: string;
    isGlowingCosplay?: boolean;
    isGlowingPrejudge?: boolean;
    isCrossedOutCosplay?: boolean;
    isCrossedOutPrejudge?: boolean;
}

export class CosplayerInstance extends Model<CosplayerAttributes> {}

CosplayerInstance.init(
    {
        stagename: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        character: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prejudge: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        prejudgeTime: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        cosplayTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        isGlowingCosplay: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: true,
        },
        isGlowingPrejudge: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: true,
        },
        isCrossedOutCosplay: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: true,
        },
        isCrossedOutPrejudge: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: true,
        },
    },
    {
        sequelize: db,
        tableName: "cosplayers",
    }
);
