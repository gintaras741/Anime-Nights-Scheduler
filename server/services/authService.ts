import db from "../database";
import { DataTypes, Model } from "sequelize";
import { CosplayerInstance } from "./cosplayerService";

interface UserAttributes {
    id: number;
    key: string;
    role: string;
    cosplayer_fk?: string | null;
}

export class UserInstance extends Model<UserAttributes> {}

UserInstance.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "user",
        },
        cosplayer_fk: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            references: {
                model: "cosplayers",
                key: "stagename",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
    },
    {
        sequelize: db,
        tableName: "users",
        timestamps: false,
    }
);
