import * as backupRepository from '~/repositories/backup.repository.ts';
import {ConflictError, NotFoundError, UnprocessableEntity} from '~/core/error.response.ts';

export const getAllBackups = async () => {
  return backupRepository.getBackups();
};

export const getBackup = async (id: number) => {
  const backup = await backupRepository.getBackupById(id);
  if (!backup) {
    throw new NotFoundError('Backup not found');
  }
  return backup;
};

export const createNewBackup = async ({filename, filepath, filesize, appId, description, userId}: {
  filename: string;
  filepath: string;
  filesize: number;
  appId: number;
  description?: string;
  userId: number;
}) => {
  return await backupRepository.createBackup(
    {
      filename,
      filepath,
      filesize,
      appId,
      description,
      userId,
    }
  );
};

export const updateExistingBackup = async (id: number, data: any) => {
  const backup = await backupRepository.getBackupById(id);
  if (!backup) {
    throw new NotFoundError('Backup not found');
  }

  if (!data || Object.keys(data).length === 0) {
    throw new UnprocessableEntity('At least one field is required');
  }

  return await backupRepository.updateBackup(id, data);
};

export const removeBackup = async (id: number) => {
  const backup = await backupRepository.getBackupById(id);
  if (!backup) {
    throw new NotFoundError('Backup not found');
  }

  await backupRepository.deleteBackup(id);
};

export const getBackupByFilename = async (filename: string) => {
  const backup = await backupRepository.getBackupByFilename(filename);
  if (!backup) {
    throw new NotFoundError('Backup not found');
  }
  return backup;
};