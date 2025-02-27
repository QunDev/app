import { IpRepository } from "~/repositories/ip.repository.ts";
import { NotFoundError, UnprocessableEntity } from "~/core/error.response.ts";
import app from "~/app.ts";
import {create} from "lodash";

export class IpService {
  private ipRepository: IpRepository;

  constructor(ipRepository: IpRepository) {
    this.ipRepository = ipRepository;
  }

  async getAllIps() {
    return this.ipRepository.getAllIps();
  }

  async getIpById(id: number) {
    if (isNaN(id)) throw new UnprocessableEntity("Invalid IP ID");
    const ip = await this.ipRepository.getIpById(id);
    if (!ip) throw new NotFoundError("IP not found");
    return ip;
  }

  async createIp(data: any) {
    if (!data.ip) throw new UnprocessableEntity("IP address is required");
    return this.ipRepository.createIp(data);
  }

  async updateIp(id: number, data: any) {
    if (isNaN(id)) throw new UnprocessableEntity("Invalid IP ID");
    return this.ipRepository.updateIp(id, data);
  }

  async deleteIp(id: number) {
    if (isNaN(id)) throw new UnprocessableEntity("Invalid IP ID");
    return this.ipRepository.deleteIp(id);
  }

  async checkIpUsage(ip: string, appId: number, userId: number) {
    if (!ip) throw new UnprocessableEntity("IP address is required");

    const ipData = await this.ipRepository.getIpByAddress(ip, appId);

    if (!ipData) {
      await this.createIp({ ip, appId, userId });
      return { status: "not_found", message: "IP does not exist" };
    }

    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    if (ipData.countUsed >= 5 && ipData.lastUsed && ipData.lastUsed >= oneDayAgo) {
      return { status: "blocked", message: "IP has been used more than 5 times in the last 24 hours" };
    }

    // Nếu chưa vượt quá 5 lần, tăng countUsed + 1
    await this.ipRepository.incrementIpCount(ip, appId);

    return { status: "allowed", message: "IP usage is within limit. Count incremented." };
  }
}

