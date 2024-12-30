import express from "express";
import countryPhone from "~/routers/countryPhone/countryPhone.ts";

const router = express.Router();

router.use(countryPhone);

export default router;