import {z} from "zod";

export const createDeviceSchema = z.object({
  deviceId: z.string().min(1, 'Device ID is required'),
})