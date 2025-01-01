// `src/routers/role.router.ts`
import express from 'express';
import * as roleController from '~/controllers/role.controller.ts';
import { validate } from '~/middlewares/validation.middleware.ts';
import { createRoleSchema, updateRoleSchema } from '~/validations/role.validation.ts';

const router = express.Router();

router.get('/', roleController.getRoles);
router.get('/:id', roleController.getRole);
router.post('/', validate(createRoleSchema), roleController.createRole);
router.put('/:id', validate(updateRoleSchema), roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

export default router;