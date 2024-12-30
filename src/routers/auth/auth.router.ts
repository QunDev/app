import express from "express";
import authController from "~/controllers/auth.controller.ts";
import {asyncHandler} from "~/helper/errorHandle.ts";
import {validateSignUp} from "~/middlewares/auth.middleware.ts";

const router = express.Router();

router.post('/signup', validateSignUp, asyncHandler(authController.signup));

export default router;