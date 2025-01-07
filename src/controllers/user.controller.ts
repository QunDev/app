import { Request, Response } from 'express'
import { PrismaService } from '~/prisma/prisma.service.ts'
import { UserRepository } from '~/repositories/user.repository.ts'
import { UserService } from '~/services/user.service.ts'

const prismaService = new PrismaService()
const userRepository = new UserRepository(prismaService)
const userService = new UserService(userRepository)

export class UserController {
  async listUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const size = parseInt(req.query.size as string) || 10

      const users = await userService.listUsers(page, size)

      res.status(200).json({ success: true, data: users })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}
