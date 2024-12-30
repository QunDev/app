import {Request, Response, NextFunction} from 'express';
import {ApiKeyService} from "~/services/apiKeyService.ts";
import {CREATED} from "~/core/success.reponse.ts";
import {getInfoData} from "~/utils";

class ApiKeyController {
  /**
   * Creates a new API Key
   * @param req - Express Request
   * @param res - Express Response
   * @param next - Express NextFunction
   */
  static async createApiKey(req: Request, res: Response, next: NextFunction) {
    const {name, userId, rateLimit, expiresAt} = req.body;

    // Generate the API Key via the service
    const apiKey = await ApiKeyService.createApiKey(name, userId, rateLimit, expiresAt);

    // Send a success response
    new CREATED({
      message: "API Key created successfully",
      metadata: getInfoData({fileds: ['key'], object: apiKey})
    }).send(res);
  }
}

export default ApiKeyController;