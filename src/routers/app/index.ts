import express from "express";
import appRouter from "~/routers/app/app.router.ts";

const router = express.Router();

router.use(appRouter);

export default router;