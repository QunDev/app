import AppRepository from "~/repositories/app.repository.ts";
import {BadRequest} from "~/core/error.response.ts";

class AppService {
  static async createApp(name: string, userId: number) {
    // Check if the app name already exists
    const app = await AppRepository.findByNameAndUserId(name, userId);
    if (app) {
      throw new BadRequest('App name already exists');
    }
    // Create a new app
    return AppRepository.create({name, userId});
  }
}

export default AppService;