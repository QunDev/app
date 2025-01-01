import { createUser, getUserByEmail } from "~/repositories/user.repository.ts";
import { ConflictError } from "~/core/error.response.ts";
import bcrypt from "bcrypt";

export const registerUserService = async (data: { name: string; email: string; password: string }) => {
  // Kiểm tra xem email đã tồn tại chưa
  const existingUser = await getUserByEmail(data.email);
  if (existingUser) {
    throw new ConflictError("Email already in use");
  }

  // Mã hóa mật khẩu
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Tạo người dùng mới
  return createUser({ ...data, password: hashedPassword });
};