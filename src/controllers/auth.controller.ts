import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { PrismaService } from '~/prisma/prisma.service.ts'
import { CREATED, NO_CONTENT, OK } from '~/core/success.response.ts'
// import {AuthSchema} from "~/validations/auth.validation.ts";
import { BadRequest } from '~/core/error.response.ts'
import { AuthRepository } from '~/repositories/auth.repository.ts'
import { AuthService } from '~/services/auth.service.ts'
import { UserRepository } from '~/repositories/user.repository.ts'
import { LoginSchema, RegisterSchema } from '~/validations/auth.validation.ts'
import { userWithRoole } from '~/types/auth.type.ts'

const prismaService = new PrismaService()
const authRepository = new AuthRepository(prismaService)
const userRepository = new UserRepository(prismaService)
const authService = new AuthService(authRepository, userRepository)

export class AuthController {
  async login(req: Request, res: Response) {
    // const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    //   modulusLength: 2048,
    //   publicKeyEncoding: { type: "pkcs1", format: "pem" },
    //   privateKeyEncoding: { type: "pkcs1", format: "pem" },
    // });
    //
    // console.log(`publicKey: ${publicKey}`);
    // console.log(`privateKey: ${privateKey}`);
    // return;
    const data = LoginSchema.parse(req.body)

    const user = (await userRepository.findByEmail(data.email)) as userWithRoole | null

    if (!user) {
      throw new BadRequest('Email not found')
    }

    // Check password
    if (!bcrypt.compareSync(data.password, user.password)) {
      throw new BadRequest('Password is incorrect')
    }

    const roles = user.roles.map((role) => role.role.name)
    // Create access token
    const accessToken = await authService.createAccessToken({ userId: user.id, roles: roles })

    // Create refresh token
    const refreshToken = await authService.createRefreshToken(user.id)

    new OK({
      message: 'Login successfully',
      metadata: { accessToken, refreshToken }
    }).send(res)
  }

  async register(req: Request, res: Response) {
    const data = RegisterSchema.parse(req.body)

    const user = await authService.registerUser(data)

    // Create access token
    const accessToken = await authService.createAccessToken({
      userId: user.id,
      roles: user.roles.map((role) => role.role.name)
    })

    // Create refresh token
    const refreshToken = await authService.createRefreshToken(user.id)

    new CREATED({
      message: 'Register successfully',
      metadata: {
        ...user,
        accessToken,
        refreshToken
      }
    }).send(res)
  }
}
