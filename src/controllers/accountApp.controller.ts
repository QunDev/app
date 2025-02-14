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
import {DeviceRepository} from "~/repositories/device.repository.ts";
import {DeviceService} from "~/services/device.service.ts";

const prismaClient = new PrismaService()
const accountAppRepository = new AccountAppRepository(prismaClient)
const userRepository = new UserRepository(prismaClient)
const appRepository = new AppRepository(prismaClient)
const deviceRepository = new DeviceRepository(prismaClient)
const accountAppService = new AccountAppService(accountAppRepository)
const userService = new UserService(userRepository)
const appService = new AppService(appRepository)
const deviceService = new DeviceService(deviceRepository)

export class AccountAppController {
  async getRandomNoRepeat(req: Request, res: Response) {
    const {userId} = req.user

    const {deviceId, appName} = req.params

    if (!deviceId) throw new BadRequest('Device ID is required')
    if (!appName) throw new BadRequest('App name is required')

    const device = await deviceService.findByDeviceId(deviceId);

    if (!device) {
      const newDevice = await deviceService.create({userId, deviceId})
      new CREATED({message: 'Device created successfully', metadata: newDevice}).send(res)
      return;
    }

    if (device.is_active === false) throw new BadRequest('Device is not active')

    if (device.is_start === false) throw new BadRequest('Device is not started')

    const accountApps = await accountAppService.getAllAccountApps()
  }

  async listAccountApps(req: Request, res: Response) {
    const { appName } = req.query;
    const accounts = await accountAppService.getAllAccountApps(appName ? appName.toString() : undefined);

    if (accounts.length === 0) {
      new OK({ message: "No accounts found", metadata: [] }).send(res);
      return;
    }

    // Cập nhật account.use = true cho tất cả tài khoản được lấy
    await Promise.all(accounts.map(account =>
      accountAppService.updateAccountApp(account.id, { used: true })
    ));

    // Định dạng dữ liệu đầu ra
    const formattedAccounts = accounts.map(account =>
      `${account.email}|${account.password}|${account.phone}|${account.sms}`
    );

    new OK({ message: "AccountApps retrieved successfully", metadata: formattedAccounts }).send(res);
  }

  async createAccountApp(req: Request, res: Response) {
    const data = createAccountAppSchema.parse(req.body)

    const app = await appService.getApp(data.appId)

    if (!app) throw new BadRequest('App not found')

    const accountApp = await accountAppService.createAccountApp({userId: req.user.userId, ...data})

    new CREATED({message: 'AccountApp created successfully', metadata: accountApp}).send(res)
  }

  async createAccountAppMany(req: Request, res: Response) {
    const data = req.body

    const accountApp = await accountAppService.createAccountAppMany(data)

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

  async getAccountAppWhereSmsIsNull(req: Request, res: Response) {
    const {appid, userid} = req.params

    if (isNaN(Number(appid))) throw new BadRequest('Id must be a number')
    if (isNaN(Number(userid))) throw new BadRequest('Id must be a number')

    const accountApp = await accountAppService.getAccountAppWhereSmsIsNull(Number(appid), Number(userid))

    new OK({message: 'AccountApp retrieved successfully', metadata: accountApp}).send(res)
  }
}