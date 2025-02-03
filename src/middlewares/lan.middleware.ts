import { Request, Response, NextFunction } from 'express'
import { BadRequest } from '~/core/error.response.ts'
import {asyncHandler} from "~/helper/errorHandle.ts";

// Regex cho các dải IP mạng LAN
const allowedLanIps = [
  /^192\.168\.\d{1,3}\.\d{1,3}$/,
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}$/,
  /^::1$/, // IPv6 localhost
  /^127\.0\.0\.1$/ // IPv4 localhost
]

/**
 * Chuẩn hóa địa chỉ IP từ IPv6-mapped IPv4 về IPv4
 * @param ip - Địa chỉ IP gốc
 * @returns IP đã chuẩn hóa
 */
const normalizeIp = (ip: string): string => {
  if (ip.startsWith('::ffff:')) {
    return ip.substring(7) // Loại bỏ tiền tố "::ffff:"
  }
  return ip
}

/**
 * Middleware kiểm tra dải IP mạng LAN
 * @param req - Yêu cầu HTTP từ client
 * @param res - Đáp ứng HTTP
 * @param next - Hàm gọi middleware tiếp theo
 */
const advancedIpMiddleware = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  const rawIp = req.ip || req.connection.remoteAddress || ''
  const clientIp = normalizeIp(rawIp) // Chuẩn hóa IP

  // Kiểm tra IP có khớp với các danh sách được cho phép không
  const isAllowedIp = allowedLanIps.some((pattern) => pattern.test(clientIp))

  if (!isAllowedIp) {
    // console.warn(`[ACCESS_DENIED] Request blocked from IP: ${clientIp} (Raw: ${rawIp})`);
    throw new BadRequest('Access denied: IP not allowed')
  }

  // console.info(`[ACCESS_ALLOWED] Request accepted from IP: ${clientIp}`);
  next()
})

export default advancedIpMiddleware
