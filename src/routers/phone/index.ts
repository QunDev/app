import express from "express";
import phoneRouter from "~/routers/phone/phone.router.ts";

const router = express.Router();

router.use(phoneRouter);

export default router;