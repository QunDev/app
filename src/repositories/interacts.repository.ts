import {PrismaClient} from "@prisma/client";


export class InteractsRepository {
  private readonly prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = new PrismaClient()
  }

  async create() {
    // return this.prisma.interacts.create()
  }
}