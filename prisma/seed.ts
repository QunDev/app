import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createUser() {
  const password = await bcrypt.hash("Matkhau@123", 10);

  try {
    const user = await prisma.user.upsert({
      where: { email: 'qun942004@gmail.com' },
      update: {},
      create: {
        email: 'qun942004@gmail.com',
        name: 'Quân Trần',
        password: password,
      },
    });
    console.log({ user });
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function createApp() {
  const name = "imo";

  try {
    const app = await prisma.app.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name,
        userId: 1
      },
    });
    console.log({ app });
    return app;
  } catch (error) {
    console.error("Error creating app:", error);
    throw error;
  }
}

async function main() {
  try {
    await createUser();
    await createApp();
  } catch (error) {
    console.error("Main function error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();