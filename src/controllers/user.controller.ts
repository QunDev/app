import { Request, Response, NextFunction } from "express";
import { registerUserService } from "~/services/user.service.ts";
import { createUserSchema } from "~/validations/user.validation.ts";
import { asyncHandler } from "~/helper/errorHandle.ts";
import { CREATED } from "~/core/success.response.ts";
import {getInfoData} from "~/utils";

export const registerUserController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Xác thực dữ liệu đầu vào
  const validatedData = createUserSchema.parse(req.body);
  const { confirmPassword, ...userData } = validatedData;

  // Gọi service để đăng ký người dùng
  const user = await registerUserService(userData);

  // Trả về phản hồi thành công
  new CREATED({
    message: "User registered successfully", metadata: getInfoData({
      fileds: ['id', 'name', 'email', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy'],
      object: user
    })
  }).send(res);
});