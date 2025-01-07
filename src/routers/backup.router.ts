import express from 'express'
import {BackupController} from "~/controllers/backup.controller.ts";
import {asyncHandler} from "~/helper/errorHandle.ts";

const router = express.Router()

const backupController = new BackupController()

router.get('/download/:appName/:filename', asyncHandler(backupController.downloadBackup))
router.get('/', asyncHandler(backupController.getBackups))
router.get('/:id', asyncHandler(backupController.getBackup))
router.post('/', asyncHandler(backupController.createBackup))
router.put('/:id', asyncHandler(backupController.updateBackup))
router.delete('/:id', (backupController.deleteBackup))

export default router
