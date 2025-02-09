import { Request, Response } from "express";
import { IpService } from "~/services/ip.service.ts";
import { IpRepository } from "~/repositories/ip.repository.ts";
import { OK, CREATED } from "~/core/success.response.ts";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ipRepository = new IpRepository(prisma);
const ipService = new IpService(ipRepository);

export class IpController {
  async getAllIps(req: Request, res: Response) {
    const ips = await ipService.getAllIps();
    new OK({ message: "IPs retrieved successfully", metadata: ips }).send(res);
  }

  async getIpById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const ip = await ipService.getIpById(id);
    new OK({ message: "IP retrieved successfully", metadata: ip }).send(res);
  }

  async createIp(req: Request, res: Response) {
    const userId = req.user.id;
    const newIp = await ipService.createIp({ ...req.body, userId });
    console.log(userId);
    new CREATED({ message: "IP created successfully", metadata: newIp }).send(res);
  }

  async updateIp(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updatedIp = await ipService.updateIp(id, req.body);
    new OK({ message: "IP updated successfully", metadata: updatedIp }).send(res);
  }

  async deleteIp(req: Request, res: Response) {
    const id = Number(req.params.id);
    await ipService.deleteIp(id);
    new OK({ message: "IP deleted successfully", metadata: undefined }).send(res);
  }

  async checkIpUsage(req: Request, res: Response) {
    const ip = req.params.ip;
    const appId = req.params.appId;
    const result = await ipService.checkIpUsage(ip, Number(appId));
    new OK({ message: result.message, metadata: result }).send(res);
  }
}

