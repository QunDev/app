import {prisma} from "~/utils/prismaClient.ts";

class AppRepository {
  static async create(data: {
    name: string;
    userId: number;
  }) {
    return prisma.app.create({
      data
    });
  }

  static async findByNameAndUserId(name: string, userId: number) {
    return prisma.app.findFirst({
      where: {
        name,
        userId,
      },
    });
  }

  static async findByIdAndUserId(id: number, userId: number) {
    return prisma.app.findUnique({
      where: {
        id,
        userId
      }
    });
  }
}

export default AppRepository;