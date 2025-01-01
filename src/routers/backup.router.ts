import express from 'express';
import * as backupController from '~/controllers/backup.controller.ts';
import { validate } from '~/middlewares/validation.middleware.ts';
import {createBackupSchema, updateBackupSchema} from '~/validations/backup.validation.ts';
import {downloadBackup} from "~/middlewares/downloadBackup.middleware.ts";

const router = express.Router();

router.get('/download/:filename',downloadBackup , backupController.downloadBackup);
router.get('/', backupController.getBackups);
router.get('/:id', backupController.getBackup);
router.post('/', validate(createBackupSchema), backupController.createBackup);
router.put('/:id', validate(updateBackupSchema), backupController.updateBackup);
router.delete('/:id', backupController.deleteBackup);

export default router;