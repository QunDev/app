import { ConflictError, NotFoundError, UnprocessableEntity } from '~/core/error.response.ts'
import {CountryPhoneRepository} from "~/repositories/countryPhone.repository.ts";

export class CountryPhoneService {
  private readonly countryPhoneRepository: CountryPhoneRepository

  constructor(countryPhoneRepository: CountryPhoneRepository) {
    this.countryPhoneRepository = countryPhoneRepository
  }

  async getAllCountryPhones() {
    return this.countryPhoneRepository.getCountryPhones()
  }

  async getCountryPhone(id: number) {
    const countryPhone = await this.countryPhoneRepository.getCountryPhoneById(id)
    if (!countryPhone) {
      throw new NotFoundError('Country phone not found')
    }
    return countryPhone
  }

  async createNewCountryPhone(data: any) {
    const { country, numberCode } = data

    // Check if numberCode already exists
    // const existingCountryPhone = await this.countryPhoneRepository.getCountryPhoneByNumberCode(numberCode)
    // if (existingCountryPhone) {
    //   throw new ConflictError('Number code already in use')
    // }

    // Create the country phone
    const newCountryPhone = await this.countryPhoneRepository.createCountryPhone(data)
    return newCountryPhone
  }

  async updateExistingCountryPhone(id: number, data: any) {
    const countryPhone = await this.countryPhoneRepository.getCountryPhoneById(id)
    if (!countryPhone) {
      throw new NotFoundError('Country phone not found')
    }

    // Check if numberCode already exists
    if (data.numberCode && data.numberCode !== countryPhone.numberCode) {
      const existingCountryPhone = await this.countryPhoneRepository.getCountryPhoneByNumberCode(data.numberCode)
      if (existingCountryPhone) {
        throw new ConflictError('Number code already in use')
      }
    }

    if (!data || Object.keys(data).length === 0) {
      throw new UnprocessableEntity('At least one field is required')
    }

    return await this.countryPhoneRepository.updateCountryPhone(id, data)
  }

  async removeCountryPhone(id: number) {
    const countryPhone = await this.countryPhoneRepository.getCountryPhoneById(id)
    if (!countryPhone) {
      throw new NotFoundError('Country phone not found')
    }

    await this.countryPhoneRepository.deleteCountryPhone(id)
  }
}