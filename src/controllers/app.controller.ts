import {NextFunction, Request, Response} from "express";
import AppService from "~/services/app.service.ts";
import {CREATED} from "~/core/success.reponse.ts";
import {getInfoData} from "~/utils";

class AppController {
  static async create(req: Request, res: Response, next: NextFunction) {
    const {name} = req.body;

    const userId = req.apiKeyRecord?.userId as number;

    const app = await AppService.createApp(name, userId);

    new CREATED({
      message: "App created successfully",
      metadata:
        getInfoData({fileds: ['name', 'createdAt'], object: app})
    }).send(res);
  }
}

export default AppController;