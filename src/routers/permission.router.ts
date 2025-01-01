import express from 'express';
import * as permissionController from '~/controllers/permission.controller.ts';
import { validate } from '~/middlewares/validation.middleware.ts';
import { createPermissionSchema, updatePermissionSchema } from '~/validations/permission.validation.ts';

const router = express.Router();

router.get('/', permissionController.getPermissions);
router.get('/:id', permissionController.getPermission);
router.post('/', validate(createPermissionSchema), permissionController.createPermission);
router.put('/:id', validate(updatePermissionSchema), permissionController.updatePermission);
router.delete('/:id', permissionController.deletePermission);

export default router;