import { ConflictError, NotFoundError, UnprocessableEntity } from '~/core/error.response.ts'
import { EmailRepository } from '~/repositories/email.repository.ts'

export class EmailService {
  private emailRepository: EmailRepository

  constructor(emailRepository: EmailRepository) {
    this.emailRepository = emailRepository
  }

  async getEmails() {
    return this.emailRepository.getEmails()
  }

  async getEmailById(id: number) {
    if (isNaN(id)) throw new UnprocessableEntity('Invalid email ID')

    const email = await this.emailRepository.getEmailById(id)
    if (!email) throw new NotFoundError('Email not found')

    return email
  }

  async createEmails(data: string[], userId: number, appId: number) {
    if (data.length > 200000) {
      throw new UnprocessableEntity('Cannot insert more than 200,000 records at once')
    }

    const emailsToInsert = data.map(email => ({
      email,
      userId,
      appId: appId
    }))

    return await this.emailRepository.createEmails(emailsToInsert)
  }

  async updateEmail(id: number, data: any) {
    if (isNaN(id)) throw new UnprocessableEntity('Invalid email ID')

    return await this.emailRepository.updateEmail(id, data)
  }

  async deleteEmail(id: number) {
    if (isNaN(id)) throw new UnprocessableEntity('Invalid email ID')

    return await this.emailRepository.deleteEmail(id)
  }

  async deleteAllEmails() {
    return this.emailRepository.deleteAllEmails()
  }

  async getRandomEmailByAppId(appId: number) {
    if (isNaN(appId)) throw new UnprocessableEntity('Invalid app ID');

    const email = await this.emailRepository.getRandomEmailByAppId(appId);
    if (!email) {
      throw new NotFoundError('No valid emails available for the given appId');
    }
    return email;
  }
}
