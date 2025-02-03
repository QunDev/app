import { ConflictError, NotFoundError, UnprocessableEntity } from '~/core/error.response.ts'
import {PhoneRepository} from "~/repositories/phone.repository.ts";

export class PhoneService {
  private phoneRepository: PhoneRepository

  constructor(phoneRepository: PhoneRepository) {
    this.phoneRepository = phoneRepository
  }

  async getPhones() {
    return this.phoneRepository.getPhones()
  }

  async getPhoneById(id: number) {
    if (isNaN(id)) throw new UnprocessableEntity('Invalid phone ID')

    return this.phoneRepository.getPhoneById(id)
  }

  async createPhones(data: any[], countryPhoneId: number, userId: number) {
    if (data.length > 200000) {
      throw new UnprocessableEntity('Cannot insert more than 100,000 records at once')
    }

    // Check for duplicate phone numbers
    const existingPhones = await this.phoneRepository.getPhones()
    const existingNumbers = new Set(existingPhones.map((phone) => phone.number))

    const uniquePhones = data.filter((phone) => {
      return !existingNumbers.has(phone)
    })
    if (uniquePhones.length === 0) {
      throw new ConflictError('All phone numbers are duplicates')
    }

    // Add countryPhoneId and userId to each phone
    const phonesToInsert = uniquePhones.map((phone) => ({
      number: phone,
      countryPhoneId,
      userId
    }))

    // Batch insert phones using transactions and parallel processing
    const batchSize = 1000 // Adjust batch size as needed
    const batches = []
    for (let i = 0; i < phonesToInsert.length; i += batchSize) {
      batches.push(phonesToInsert.slice(i, i + batchSize))
    }

    await Promise.all(batches.map((batch) => this.phoneRepository.createPhones(batch)))

    return { count: phonesToInsert.length }
  }

  async updatePhone(id: number, data: any) {
    if (isNaN(id)) throw new UnprocessableEntity('Invalid phone ID')

    const phone = await this.phoneRepository.getPhoneById(id)
    if (!phone) {
      throw new NotFoundError('Phone not found')
    }

    if (!data || Object.keys(data).length === 0) {
      throw new UnprocessableEntity('At least one field is required')
    }

    return this.phoneRepository.updatePhone(id, data)
  }

  async deletePhone(id: number) {
    if (isNaN(id)) throw new UnprocessableEntity('Invalid phone ID')

    const phone = await this.phoneRepository.getPhoneById(id)

    if (!phone) {
      throw new NotFoundError('Phone not found')
    }

    return await this.phoneRepository.deletePhone(id)
  }

  async deleteAllPhones() {
    return this.phoneRepository.deleteAllPhones()
  }

  async getRandomPhoneByAppId(appId: number) {
    if (isNaN(appId)) throw new UnprocessableEntity('Invalid app ID')

    const phone = await this.phoneRepository.getRandomPhoneByAppId(appId)
    if (!phone) {
      throw new NotFoundError('Phone not found')
    }
    return phone
  }

  async updatePhones(data: { id: number; updateData: any }[]) {
    if (!data || data.length === 0) {
      throw new UnprocessableEntity('No records to update')
    }

    return await this.phoneRepository.updatePhones(data)
  }

  async updateAppIdAllPhones(appId: number, phoneIds: number[]) {
    if (!phoneIds || phoneIds.length === 0) {
      throw new UnprocessableEntity('No phone IDs provided')
    }

    if (!appId) {
      throw new UnprocessableEntity('App ID is required')
    }

    const changePhoneIdsToNumber = phoneIds.map((phoneId) => Number(phoneId))

    return await this.phoneRepository.updateAppIdAllPhones(appId, changePhoneIdsToNumber)
  }

  async getPhoneByNumber(number: string) {
    return this.phoneRepository.getPhoneByNumber(number)
  }
}