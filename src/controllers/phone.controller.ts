import { Request, Response, NextFunction } from 'express'
import { OK, CREATED } from '~/core/success.response.ts'
import {PhoneRepository} from "~/repositories/phone.repository.ts";
import {PhoneService} from "~/services/phone.service.ts";
import {PrismaClient} from "@prisma/client";
import {NotFoundError, UnprocessableEntity} from "~/core/error.response.ts";
import {createPhoneSchema, updatePhoneSchema} from "~/validations/phone.validation.ts";

const prismaClient = new PrismaClient()
const phoneRepository = new PhoneRepository(prismaClient)
const phoneService = new PhoneService(phoneRepository)

export class PhoneController {
  async getPhones(req: Request, res: Response) {
    const phones = await phoneService.getPhones()
    new OK({ message: 'Phones retrieved successfully', metadata: phones }).send(res)
  }

  async getPhone(req: Request, res: Response) {
    const id = Number(req.params.id)

    if (isNaN(id)) throw new UnprocessableEntity('Invalid phone ID')

    const phone = await phoneService.getPhoneById(id)

    new OK({ message: 'Phone retrieved successfully', metadata: phone }).send(res)
  }

  async createPhones(req: Request, res: Response, next: NextFunction) {
    const { numbers, countryPhoneId, userId } = createPhoneSchema.parse(req.body)
    const newPhones = await phoneService.createPhones(numbers, countryPhoneId, userId)
    new CREATED({ message: 'Phones created successfully', metadata: newPhones }).send(res)
  }

  async updatePhone(req: Request, res: Response) {
    const id = Number(req.params.id)
    const data = updatePhoneSchema.parse(req.body)

    if (isNaN(id)) throw new UnprocessableEntity('Invalid phone ID')

    const phone = await phoneService.getPhoneById(id)
    if (!phone) {
      throw new NotFoundError('Phone not found')
    }

    if (!data || Object.keys(data).length === 0) {
      throw new UnprocessableEntity('At least one field is required')
    }

    const updatedPhone = await phoneService.updatePhone(id, data)
    new OK({ message: 'Phone updated successfully', metadata: updatedPhone }).send(res)
  }

  async deletePhone(req: Request, res: Response) {
    const id = Number(req.params.id)

    if (isNaN(id)) throw new UnprocessableEntity('Invalid phone ID')

    const phone = await phoneService.getPhoneById(id)

    if (!phone) {
      throw new NotFoundError('Phone not found')
    }

    await phoneService.deletePhone(id)
    new OK({ message: 'Phone deleted successfully', metadata: undefined }).send(res)
  }

  async deleteAllPhones(req: Request, res: Response) {
    await phoneService.deleteAllPhones()
    new OK({ message: 'All phones deleted successfully', metadata: undefined }).send(res)
  }

  async getRandomPhoneByAppId(req: Request, res: Response) {
    const appId = Number(req.params.appId)

    if (isNaN(appId)) throw new UnprocessableEntity('Invalid app ID')

    const phone = await phoneService.getRandomPhoneByAppId(appId)
    new OK({ message: 'Phone retrieved successfully', metadata: phone }).send(res)
  }

  async updatePhones(req: Request, res: Response) {
    const data = req.body

    const updateResults = await phoneService.updatePhones(data)
    new OK({ message: 'Phones updated successfully', metadata: updateResults }).send(res)
  }

  async updateAppIdAllPhones(req: Request, res: Response) {
    const { appId, phoneIds } = req.body

    if (!phoneIds || phoneIds.length === 0) {
      throw new UnprocessableEntity('No phone IDs provided')
    }

    if (!appId) {
      throw new UnprocessableEntity('App ID is required')
    }

    await phoneService.updateAppIdAllPhones(appId, phoneIds)
    new OK({ message: 'Phones updated successfully', metadata: undefined }).send(res)
  }

}