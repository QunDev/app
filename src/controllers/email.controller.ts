import {Request, Response, NextFunction} from 'express'
import {OK, CREATED} from '~/core/success.response.ts'
import {EmailRepository} from '~/repositories/email.repository.ts'
import {EmailService} from '~/services/email.service.ts'
import {PrismaClient} from '@prisma/client'
import {NotFoundError, UnprocessableEntity} from '~/core/error.response.ts'
import {createEmailSchema, updateEmailSchema} from '~/validations/email.validation.ts'

const prismaClient = new PrismaClient()
const emailRepository = new EmailRepository(prismaClient)
const emailService = new EmailService(emailRepository)

export class EmailController {
  async getEmails(req: Request, res: Response) {
    const emails = await emailService.getEmails()
    new OK({message: 'Emails retrieved successfully', metadata: emails}).send(res)
  }

  async getEmail(req: Request, res: Response) {
    const id = Number(req.params.id)
    if (isNaN(id)) throw new UnprocessableEntity('Invalid email ID')

    const email = await emailService.getEmailById(id)
    if (!email) throw new NotFoundError('Email not found')

    new OK({message: 'Email retrieved successfully', metadata: email}).send(res)
  }

  async createEmails(req: Request, res: Response) {
    const {emails, appId} = createEmailSchema.parse(req.body)
    if (appId && isNaN(appId)) throw new UnprocessableEntity('Invalid app ID')
    const newEmails = await emailService.createEmails(emails, req.user.userId, Number(appId))
    new CREATED({message: 'Emails created successfully', metadata: newEmails}).send(res)
  }

  async updateEmail(req: Request, res: Response) {
    const id = Number(req.params.id)
    if (isNaN(id)) throw new UnprocessableEntity('Invalid email ID')

    const data = updateEmailSchema.parse(req.body)
    if (!data || Object.keys(data).length === 0) {
      throw new UnprocessableEntity('At least one field is required')
    }

    const updatedEmail = await emailService.updateEmail(id, {userId: req.user.userId, ...data})
    new OK({message: 'Email updated successfully', metadata: updatedEmail}).send(res)
  }

  async deleteEmail(req: Request, res: Response) {
    const id = Number(req.params.id)
    if (isNaN(id)) throw new UnprocessableEntity('Invalid email ID')

    await emailService.deleteEmail(id)
    new OK({message: 'Email deleted successfully', metadata: null}).send(res)
  }

  async deleteAllEmails(req: Request, res: Response) {
    await emailService.deleteAllEmails()
    new OK({message: 'All emails deleted successfully', metadata: null}).send(res)
  }

  async getRandomEmail(req: Request, res: Response) {
    const email = await emailService.getRandomEmail();
    new OK({ message: 'Random email retrieved successfully', metadata: email }).send(res);
  }
}
