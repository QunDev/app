import {Request, Response} from 'express'
import {CREATED, OK} from '~/core/success.response.ts'
import {createAccountAppSchema, updateAccountAppSchema} from '~/validations/accountApp.validation.ts'
import {AccountAppRepository} from "~/repositories/accountApp.repository.ts";
import {AccountAppService} from "~/services/accountApp.service.ts";
import {BadRequest} from "~/core/error.response.ts";
import {UserService} from "~/services/user.service.ts";
import {UserRepository} from "~/repositories/user.repository.ts";
import {AppService} from "~/services/app.service.ts";
import {AppRepository} from "~/repositories/app.repository.ts";
import {PrismaService} from '~/prisma/prisma.service'

const prismaClient = new PrismaService()
const accountAppRepository = new AccountAppRepository(prismaClient)
const userRepository = new UserRepository(prismaClient)
const appRepository = new AppRepository(prismaClient)
const accountAppService = new AccountAppService(accountAppRepository)
const userService = new UserService(userRepository)
const appService = new AppService(appRepository)

export class AccountAppController {
  async listAccountApps(req: Request, res: Response) {
    const accountApps = await accountAppService.getAllAccountApps()

    new OK({message: 'AccountApps retrieved successfully', metadata: accountApps}).send(res)
  }

  async createAccountApp(req: Request, res: Response) {
    const data = createAccountAppSchema.parse(req.body)

    const app = await appService.getApp(data.appId)

    if (!app) throw new BadRequest('App not found')

    const accountApp = await accountAppService.createAccountApp({userId: req.user.userId, ...data})

    new CREATED({message: 'AccountApp created successfully', metadata: accountApp}).send(res)
  }

  async getAccountApp(req: Request, res: Response) {
    const {id} = req.params

    if (isNaN(Number(id))) throw new BadRequest('Id must be a number')

    const accountApp = await accountAppService.getAccountAppById(Number(id))

    new OK({message: 'AccountApp retrieved successfully', metadata: accountApp}).send(res)
  }

  async updateAccountApp(req: Request, res: Response) {
    const {id} = req.params
    if (isNaN(Number(id))) throw new BadRequest('Id must be a number')
    const data = updateAccountAppSchema.parse(req.body)

    const accountApp = await accountAppService.updateAccountApp(Number(id), data)

    new OK({message: 'AccountApp updated successfully', metadata: accountApp}).send(res)
  }

  async deleteAccountApp(req: Request, res: Response) {
    const {id} = req.params

    if (isNaN(Number(id))) throw new BadRequest('Id must be a number')

    await accountAppService.deleteAccountApp(Number(id))

    new OK({message: 'AccountApp deleted successfully', metadata: null}).send(res)
  }

}