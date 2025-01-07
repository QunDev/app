import { User } from '@prisma/client'
import { UserRepository } from '~/repositories/user.repository.ts'

export class UserService {
  private readonly userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  // Lấy thông tin chi tiết User
  async getUserDetails(id: number): Promise<User | null> {
    const user = await this.userRepository.getUserWithRelations(id)
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }

  // Xử lý logic cập nhật thông tin User
  async updateUser(id: number, data: Partial<User>): Promise<User> {
    return await this.userRepository.updateUser(id, data)
  }

  // Xóa User và logic liên quan
  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.getUserById(id)
    if (!user) {
      throw new Error('User not found')
    }
    await this.userRepository.deleteUser(id)
  }

  // Lấy danh sách Users với phân trang
  async listUsers(page: number, size: number): Promise<User[]> {
    const skip = (page - 1) * size
    const take = size
    return await this.userRepository.getUsers(skip, take)
  }
}
