import express from 'express';
import * as appController from '~/controllers/app.controller.ts';
import { validate } from '~/middlewares/validation.middleware.ts';
import { createAppSchema, updateAppSchema } from '~/validations/app.validation.ts';

const router = express.Router();

router.get('/', appController.getApps);
router.get('/:id', appController.getApp);
router.post('/', validate(createAppSchema), appController.createApp);
router.put('/:id', validate(updateAppSchema), appController.updateApp);
router.delete('/:id', appController.deleteApp);

export default router;