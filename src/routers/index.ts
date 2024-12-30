import express from 'express';
import authRouter from "~/routers/auth";
import advancedIpMiddleware from "~/middlewares/lan.middleware.ts";
import apiKeyMiddleware from "~/middlewares/apiKey.middleware.ts";
import appRouter from "~/routers/app";
import phoneRouter from "~/routers/phone";
import countryPhone from "~/routers/countryPhone";

const router = express.Router();


// check apiKey
router.use(apiKeyMiddleware);
// check permission
router.use(advancedIpMiddleware);

router.use("/auth", authRouter);
router.use('/app', appRouter);
router.use('/phone', phoneRouter);
router.use('/countryphone', countryPhone);

export default router;