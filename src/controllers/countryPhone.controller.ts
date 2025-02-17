import { Request, Response, NextFunction } from 'express'
import { OK, CREATED } from '~/core/success.response.ts'
import {PrismaClient} from "@prisma/client";
import {CountryPhoneRepository} from "~/repositories/countryPhone.repository.ts";
import {CountryPhoneService} from "~/services/countryPhone.service.ts";
import {BadRequest} from "~/core/error.response.ts";
import {createCountryPhoneSchema, updateCountryPhoneSchema} from "~/validations/countryPhone.validation.ts";

const prismaClient = new PrismaClient()
const countryPhoneRepository = new CountryPhoneRepository(prismaClient)
const countryPhoneService = new CountryPhoneService(countryPhoneRepository)

export class CountryPhoneController {
  async getCountryPhones(req: Request, res: Response, next: NextFunction) {
    const countryPhones = await countryPhoneService.getAllCountryPhones()
    new OK({ message: 'Country phones retrieved successfully', metadata: countryPhones }).send(res)
  }

  async getCountryPhoneByDeviceId(req: Request, res: Response, next: NextFunction) {
    if (isNaN(Number(req.params.id))) throw new BadRequest('Invalid device ID')
    const countryPhone = await countryPhoneService.getCountryPhoneByDeviceId(Number(req.params.id))
    new OK({ message: 'Country phone retrieved successfully', metadata: countryPhone }).send(res)
  }

  async getCountryPhone(req: Request, res: Response, next: NextFunction) {
    if (isNaN(Number(req.params.id))) throw new BadRequest('Invalid country phone ID')
    const countryPhone = await countryPhoneService.getCountryPhone(Number(req.params.id))
    new OK({ message: 'Country phone retrieved successfully', metadata: countryPhone }).send(res)
  }

  async createCountryPhone(req: Request, res: Response, next: NextFunction) {
    const data = createCountryPhoneSchema.parse(req.body)
    const newCountryPhone = await countryPhoneService.createNewCountryPhone(data)
    new CREATED({ message: 'Country phone created successfully', metadata: newCountryPhone }).send(res)
  }

  async updateCountryPhone(req: Request, res: Response, next: NextFunction) {
    if (isNaN(Number(req.params.id))) throw new BadRequest('Invalid country phone ID')
    const data = updateCountryPhoneSchema.parse(req.body)
    const updatedCountryPhone = await countryPhoneService.updateExistingCountryPhone(Number(req.params.id), data)
    new OK({ message: 'Country phone updated successfully', metadata: updatedCountryPhone }).send(res)
  }

  async deleteCountryPhone(req: Request, res: Response, next: NextFunction) {
    if (isNaN(Number(req.params.id))) throw new BadRequest('Invalid country phone ID')
    await countryPhoneService.removeCountryPhone(Number(req.params.id))
    new OK({ message: 'Country phone deleted successfully', metadata: undefined }).send(res)
  }
}