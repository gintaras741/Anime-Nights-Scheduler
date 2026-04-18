module.exports = {
    apps: [
        {
            name: "anime-nights-api",
            cwd: "./server",
            script: "npm",
            args: "start",
            env: {
                NODE_ENV: "production",
                PORT: 3000,
                CORS_ORIGINS: "https://an.gintaras.me,http://an.gintaras.me,http://localhost:5173,http://localhost:3000",
            },
        },
    ],
};
