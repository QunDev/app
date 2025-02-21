import { App } from '@prisma/client'
import { AppRepository } from '~/repositories/app.repository.ts'

export class AppService {
  private readonly appRepository: AppRepository

  constructor(appRepository: AppRepository) {
    this.appRepository = appRepository
  }

  async getApps() {
    return this.appRepository.getAllApps()
  }

  async getApp(id: number) {
    return this.appRepository.getApp(id)
  }

  async getByName(name: string) {
    return this.appRepository.getAppByName(name)
  }

  async createApp(data: Pick<App, 'name' | 'userId' | 'filepath'>): Promise<App> {
    return this.appRepository.createNewApp(data)
  }

  async updateApp(id: number, data: Partial<App>): Promise<App> {
    return this.appRepository.updateExistingApp(id, data)
  }

  async deleteApp(id: number) {
    return this.appRepository.removeApp(id)
  }

  async updateAppVersion(id: number, version: string) {
    return this.appRepository.updateAppVersion(id, version)
  }
}
