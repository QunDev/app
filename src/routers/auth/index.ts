import express from 'express';
import apiKeyRouter from "~/routers/auth/apiKey.router.ts";
import authRouter from "~/routers/auth/auth.router.ts";

const router = express.Router();

router.use(apiKeyRouter);
router.use(authRouter);

export default router;