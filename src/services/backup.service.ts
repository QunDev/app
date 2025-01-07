import {UnprocessableEntity} from '~/core/error.response.ts'
import {BackupRepository} from "~/repositories/backup.repository.ts";

export class BackupService {
  private readonly backupRepository;

  constructor(backupRepository: BackupRepository) {
    this.backupRepository = backupRepository;
  }

  async getBackups() {
    return this.backupRepository.getBackups();
  }

  async getBackupById(id: number) {
    if (isNaN(id)) {
      throw new UnprocessableEntity('Invalid ID')
    }

    return this.backupRepository.getBackupById(id);
  }

  async createBackup(data: any) {
    if (!data) {
      throw new UnprocessableEntity('Data is required')
    }

    return this.backupRepository.createBackup(data);
  }

  async updateBackup(id: number, data: any) {
    if (isNaN(id)) {
      throw new UnprocessableEntity('Invalid ID')
    }
    if (!data) {
      throw new UnprocessableEntity('Data is required')
    }

    return this.backupRepository.updateBackup(id, data);
  }

  async deleteBackup(id: number) {
    if (isNaN(id)) {
      throw new UnprocessableEntity('Invalid ID')
    }

    return this.backupRepository.deleteBackup(id);
  }

  async getBackupByFilename(filename: string) {
    return this.backupRepository.getBackupByFilename(filename);
  }
}