import { NotFoundError } from '~/core/error.response.ts'
import { accountApp } from '@prisma/client'
import {AccountAppRepository} from "~/repositories/accountApp.repository.ts";

export class AccountAppService {
  private readonly accountAppRepository: AccountAppRepository

  constructor(accountAppRepository: AccountAppRepository) {
    this.accountAppRepository = accountAppRepository
  }

  async getAllAccountApps(): Promise<accountApp[]> {
    return await this.accountAppRepository.getAllAccountApps()
  }

  async createAccountApp(data: Pick<accountApp, 'userId' | 'appId'>): Promise<accountApp> {
    return await this.accountAppRepository.createAccountApp(data)
  }

  async getAccountAppById(id: number): Promise<accountApp | null> {
    const account = await this.accountAppRepository.getAccountAppById(id)

    if (!account) {
      throw new NotFoundError('AccountApp not found')
    }

    return account
  }

  async updateAccountApp(id: number, data: Partial<accountApp>): Promise<accountApp> {
    return await this.accountAppRepository.updateAccountApp(id, data)
  }

  async deleteAccountApp(id: number): Promise<void> {
    const account = await this.accountAppRepository.getAccountAppById(id)

    if (!account) {
      throw new NotFoundError('AccountApp not found')
    }

    await this.accountAppRepository.deleteAccountApp(id)
  }
}
