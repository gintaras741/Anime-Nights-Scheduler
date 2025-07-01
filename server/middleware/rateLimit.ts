import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: {
        status: 429,
        error: "Too many requests, please try again later.",
    },
});

export default limiter;
