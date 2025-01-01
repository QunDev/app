import express from "express";
import { registerUserController } from "~/controllers/user.controller.ts";
import { validate } from "~/middlewares/validation.middleware.ts";
import { createUserSchema } from "~/validations/user.validation.ts";

const router = express.Router();

router.post("/register", validate(createUserSchema), registerUserController);

export default router;