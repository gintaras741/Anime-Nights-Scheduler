import { UserInstance } from "./authService";
import { CosplayerInstance } from "./cosplayerService";

UserInstance.belongsTo(CosplayerInstance, {
    foreignKey: "cosplayer_fk",
    targetKey: "stagename",
    as: "cosplayer",
});

CosplayerInstance.hasOne(UserInstance, {
    foreignKey: "cosplayer_fk",
    sourceKey: "stagename",
    as: "user",
});

export { UserInstance, CosplayerInstance };
