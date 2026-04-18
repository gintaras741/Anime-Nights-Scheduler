import { Sequelize } from "sequelize";
import path from "path";

const db = new Sequelize({
    dialect: "sqlite",
    storage:
        process.env.DB_PATH || path.resolve(__dirname, "..", "database.db"),
});

export default db;