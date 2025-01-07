import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function createRole() {
  const name = ['Admin', 'User']

  try {
    const roles = await prisma.role.createMany({
      data: [
        {
          name: name[0],
          description: 'Admin role'
        },
        {
          name: name[1],
          description: 'User role'
        }
      ]
    })
    return roles
  } catch (error) {
    console.error('Error creating role:', error)
    throw error
  }
}

async function permission() {
  try {
    const permissions = await prisma.permission.createMany({
      data: [
        {
          name: 'Create',
          description: 'Create permission'
        },
        {
          name: 'Read',
          description: 'Read permission'
        },
        {
          name: 'Write',
          description: 'Write permission'
        },
        {
          name: 'Update',
          description: 'Update permission'
        },
        {
          name: 'Delete',
          description: 'Delete permission'
        }
      ]
    })
    return permissions
  } catch (error) {
    console.error('Error creating permission:', error)
    throw error
  }
}

async function createRolePermission() {
  try {
    const rolePermission = await prisma.rolePermission.createMany({
      data: [
        {
          roleId: 1,
          permissionId: 1
        },
        {
          roleId: 1,
          permissionId: 2
        },
        {
          roleId: 1,
          permissionId: 3
        },
        {
          roleId: 1,
          permissionId: 4
        },
        {
          roleId: 1,
          permissionId: 5
        }
      ]
    })
    return rolePermission
  } catch (error) {
    console.error('Error creating role permission:', error)
    throw error
  }
}

async function createUser() {
  const password = await bcrypt.hash('Matkhau@123', 12)

  try {
    const user = await prisma.user.upsert({
      where: { email: 'qun942004@gmail.com' },
      update: {},
      create: {
        email: 'qun942004@gmail.com',
        name: 'Quân Trần',
        password: password,
        roles: {
          create: {
            roleId: 1
          }
        }
      }
    })
    return user
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

// async function createApp() {
//   const name = "imo";
//
//   try {
//     const app = await prisma.app.upsert({
//       where: { id: 1 },
//       update: {},
//       create: {
//         name,
//         userId: 1
//       },
//     });
//     console.log({ app });
//     return app;
//   } catch (error) {
//     console.error("Error creating app:", error);
//     throw error;
//   }
// }

async function main() {
  try {
    await createRole()
    await permission()
    await createRolePermission()
    await createUser()
  } catch (error) {
    console.error('Main function error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
